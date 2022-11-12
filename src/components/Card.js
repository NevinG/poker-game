export function Card(props){
    //props.suit
    //propts.number
    //props.width
    //props.height
    const numberMap = {
        2 : "2",
        3 : "3", 
        4 : "4", 
        5 : "5", 
        6 : "6", 
        7 : "7",
        8 : "8", 
        9 : "9",
        10 : "10",
        11 : "J",
        12 : "Q",
        13 : "K",
        14 : "A"
    }

    let suitPath;
    switch(props.suit){
        case 0:
            suitPath = require("../images/heartIcon.png");
            break;
        case 1:
            suitPath = require("../images/spadeIcon.png");
            break;
        case 2:
            suitPath = require("../images/clubIcon.png");
            break;
        case 3:
            suitPath = require("../images/diamondIcon.png");
            break;
        default:
            suitPath = require("../images/heartIcon.png");
            break;
    }

    return (
        <div>
            {
            !props.blank 
            ?
            <div style={{width: props.width, backgroundColor: "white",  height: props.height, border: "2px solid black", borderRadius: props.width / 8, margin: "5px", display:"flex", flexDirection: "column"}}>
                <p style={{textAlign: "left", margin: 0, marginLeft: 5, fontSize: props.width / 3}}>{numberMap[props.number]}</p>
                <img src={suitPath} width={props.width / 2} height={props.width / 2} alt='suit' style={{margin: "auto"}}></img>
                <p style={{textAlign: "right", margin: 0, marginRight: 5, fontSize: props.width / 3}}>{numberMap[props.number]}</p>
            </div>
            :
            <div style={{width: props.width, height: props.height, border: "2px solid black", borderRadius: props.width / 8, margin: "5px", backgroundColor: "salmon"}}>
            </div>
            }
        </div>
    )
}