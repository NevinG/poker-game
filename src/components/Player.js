import { Card } from './Card.js';

const screenHeight = window.innerHeight;
export function Player(props){
    //props.name
    //props.money
    //props.bet
    //props.turn
    //props.smallBlind
    //props.bigBlind
    return (
        <div style={{borderBottom: props.turn ? "5px solid yellow" : "", opacity: props.folded && !props.winner ? ".2" : "", margin: "10px", backgroundColor: (props.votedToStart && "rgba(0, 255, 0, 0.2)") || (props.winner && "lightyellow")}}>
          <h3 style={{textAlign: "center", margin: "2px"}}>{props.name}</h3>
          <h4 style={{textAlign: "center", margin: "2px"}}>${props.money}</h4>
          <div style={{display: 'flex', justifyContent: "center", alignItems: "center"}}>
            {props.cards ?
              props.cards.map((card, i)=><Card key={i} width={screenHeight / 16} height={screenHeight / 8} number={card.number} suit={card.suit} />)
            :
              [<Card key={0} width={screenHeight / 16} height={screenHeight / 8} blank={true}/>, <Card key={1} width={screenHeight / 16} height={screenHeight / 8} blank={true}/>]
            }
          </div>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h4 style={{margin: "5px", textAlign: "center"}}>${props.bet}</h4>
            {props.bigBlind && <img src={require('../images/bigBlindToken.png')} width={25} height={25} alt='suit' style={{margin: "5px"}}></img>}
            {props.smallBlind && <img src={require('../images/smallBlindToken.png')} width={25} height={25} alt='suit' style={{margin: "5px"}}></img>}
          </div>
        </div>
    )
}