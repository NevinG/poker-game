import './App.css';
import { useState } from 'react';
import { Card } from './components/Card.js';
import { Player } from './components/Player.js';

let ws = null;
const screenHeight = window.innerHeight;

function App() {
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [started, setStarted] = useState(false);
  const [bet, setBet] = useState(0);
  const [yourBet, setYourBet] = useState(0);
  const [cards, setCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [yourCards, setYourCards] = useState([]);
  const [yourMoney, setYourMoney] = useState(0);
  const [yourTurn, setYourTurn] = useState(false);
  const [folded, setFolded] = useState(false);
  const [name, setName] = useState("");
  const [smallBlind, setSmallBlind] = useState(false);
  const [bigBlind, setBigBlind] = useState(false);
  const [votedToStart, setVotedToStart] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [winner, setWinner] = useState(false);

  const [lobbyId, setLobbyId] = useState("");


  return (
    <div>
      {!joinedLobby ? 
      <div>
        <h1 style={{textAlign: "center"}}>Poker</h1>
        <div style={{width: "400px", margin: "auto"}}>
          <button onClick={createLobby}>Create Lobby</button>
          <button onClick={()=> joinLobby(lobbyId)}>Join Lobby</button>
          <input style={{width: "70px"}} type="text" onChange={changeLobbyId}></input>
          <label>Name:  </label>
          <input style={{width: "70px"}} type="text" onChange={changeName}></input>
        </div>
      </div>
      :
      <div style={{margin: "10px"}}>
        <h1 hidden={started} style={{textAlign: "center"}}>LOBBY CODE: {lobbyId}</h1>

        <div style={{display: "flex", justifyContent: "center", alignItems: "center", margin:"auto"}}>
          {otherPlayers.map((player, i) =>{
            return <Player key={i} name={player.name} money={player.money} bet={player.bet} winner={player.winner} turn={player.turn} bigBlind={player.bigBlind} folded={player.folded} smallBlind={player.smallBlind} cards={player.cards} votedToStart={!started ? player.votedToStart : false}/>;
          })}
        </div>

        <div style={{width: "750px", margin: "5px auto"}}>
          <div style={{display: 'flex', justifyContent: "center", alignItems: "center"}}>
            {cards.map((card, i) => <Card key={i} suit={card.suit} number={card.number} width={screenHeight / 12} height={screenHeight / 6}/>)}
            {[...Array(5 - cards.length)].map((card, i) => <Card key={i} blank={true} width={screenHeight / 12} height={screenHeight / 6}/>)}
            <h2 style={{textAlign: "center", margin: "5px"}}>${pot}</h2>
          </div>
        </div>

        <div style={{width: "250px", backgroundColor: winner && "lightyellow",borderBottom: yourTurn ? "5px solid yellow" : "", margin: "10px auto"}}>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <h4 style={{margin: "2px", textAlign: "center"}}>${yourBet}</h4>
            {bigBlind && <img src={require('./images/bigBlindToken.png')} width={25} height={25} alt='suit' style={{margin: "5px"}}></img>}
            {smallBlind && <img src={require('./images/smallBlindToken.png')} width={25} height={25} alt='suit' style={{margin: "5px"}}></img>}
          </div>
          <div style={{display: 'flex', justifyContent: "center", alignItems: "center"}}>
            {yourCards.length > 0
            ? 
              yourCards.map((card, i) => <Card key = {i} suit={card.suit} number={card.number} width={screenHeight / 12} height={screenHeight / 6}/>) 
            : 
              [<Card key={0} width={screenHeight / 12} height={screenHeight / 6} blank={true}/>, <Card key={1} width={screenHeight / 12} height={screenHeight / 6} blank={true}/>]}
          </div>
          <h2 style={{textAlign: "center", margin: "5px"}}>{name}</h2>
          <h3 style={{textAlign: "center", margin: "5px"}}>${yourMoney}</h3>
        </div>

        <div style={{width: "390px", margin: "auto"}}>
          {started?
            <div hidden={folded}>
              <button disabled={folded} onClick={fold}>Fold</button>
              <button onClick={()=> {makeBet(bet)}}>Check/Call</button>
              <button onClick={()=> {makeBet(raiseAmount)}}>Raise</button>
              <input style={{width: "70px"}} type="number" data={raiseAmount} onChange={(e)=>changeRaiseAmount(e)}></input>
            </div>
          :
            (otherPlayers.length > 1) ?
              <button onClick={startGame} style={{display: votedToStart ? "none" : "block", margin: "auto"}}>Start Game</button>
              :
              <h1 style={{textAlign: "center"}}>Waiting for players...</h1>
          }
        </div>
      </div>
      }
    </div>
  );

  function changeName(e){
    setName(e.target.value);
  }
  function changeRaiseAmount(e){
    setRaiseAmount(e.target.value);
  }

  function changeLobbyId(e){
    setLobbyId(e.target.value);
  }

  async function joinLobby(){
    await connectToServer();
    ws.send(JSON.stringify({joinLobby: true, lobbyId: lobbyId, name: name}));
  }

  async function createLobby(){
    await connectToServer();
    ws.send(JSON.stringify({createLobby: true, name: name}));
  }
  
  function startGame(){
    ws.send(JSON.stringify({startGame: true, lobbyId: lobbyId}));
  }
  
  function fold(){
    ws.send(JSON.stringify({folded: true, lobbyId: lobbyId}));
  }
  
  function makeBet(betAmount){
    ws.send(JSON.stringify({bet: true, betAmount: betAmount, lobbyId: lobbyId}))
  }
  
  async function connectToServer(){
    if(ws == null){
      await connect();
      
      ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        console.log(messageBody);
        setOtherPlayers(messageBody.players);
        setStarted(messageBody.started);
        setBet(messageBody.bet);
        setYourBet(messageBody.yourBet);
        setCards(messageBody.flippedCards);
        setPot(messageBody.pot);
        setYourCards(messageBody.cards);
        setYourMoney(messageBody.money);
        setFolded(messageBody.folded);
        setYourTurn(messageBody.turn); 
        setName(messageBody.name);
        setBigBlind(messageBody.bigBlind);
        setSmallBlind(messageBody.smallBlind);
        setVotedToStart(messageBody.votedToStart);
        setWinner(messageBody.winner);
        
        setLobbyId(messageBody.lobbyId);
        setJoinedLobby(messageBody.lobbyId !== undefined);
      };
    }
  }

  function connect() {
    return new Promise(function(resolve, reject) {
      ws = new WebSocket('ws://nevin-gilday-poker-server.herokuapp.com/ws');
        ws.onopen = function() {
            resolve();
        };
        ws.onerror = function(err) {
            reject(err);
        };

    });
}
}
export default App;
