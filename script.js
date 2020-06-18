// blackjack
let blackJackGame={
	'you':{'scoreSpan':'#your-blackjack-result','div':'#your-box','score':0},
	'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
	'cards':['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
	'cardMaps':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]},
	'wins':0,
	'losses':0,
	'draws':0,
	'isStand':false,
	'turnsOver':false,
	'deactivate':false,
};

const YOU=blackJackGame['you'];
const DEALER=blackJackGame['dealer'];
const hitSound=new Audio('swish.m4a');
const winSound=new Audio('cash.mp3');
const lossSound=new Audio('aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click',dealerLogic);

document.querySelector('#blckjack-deal-button').addEventListener('click',blackjackDeal);

function blackjackHit() {
	if(blackJackGame['isStand']===false){
		let card=randomcard();
		showCard(card,YOU);
		updateScore(card,YOU);
		showScore(YOU);
		blackJackGame['deactivate']=false;
	}
	
}

function randomcard(){
	let index=Math.floor(Math.random()*13);
	return blackJackGame['cards'][index];
}


function showCard(card,activePlayer){
	if(activePlayer['score']<=21){
		let cardImage=document.createElement('img');
		cardImage.src=`${card}.png`;
		cardImage.classList.add("imageSize");
		document.querySelector(activePlayer['div']).appendChild(cardImage);
		hitSound.play();
	}
	
}
function blackjackDeal(){
	if(blackJackGame['turnsOver']===true){

		blackJackGame['isStand']=false;

		let yourImages=document.querySelector('#your-box').querySelectorAll('img');
		let dealerImages=document.querySelector('#dealer-box').querySelectorAll('img');
		
		for(i=0;i<yourImages.length;i++){
			yourImages[i].remove();

		}
		for(i=0;i<dealerImages.length;i++){
			dealerImages[i].remove();

		}
		YOU['score']=0;
		DEALER['score']=0;
		document.querySelector('#your-blackjack-result').style.color='white';
		document.querySelector('#dealer-blackjack-result').style.color='white';

		document.querySelector('#your-blackjack-result').textContent=0;
		document.querySelector('#dealer-blackjack-result').textContent=0;
		document.querySelector('#blackjack-result').textContent="Let's Play";
		document.querySelector('#blackjack-result').style.color='black';
	
		blackJackGame['turnsOver']=false;
	}
	

}

function updateScore(card,activePlayer){
	if(card==='A'){
		if(activePlayer['score']+blackJackGame['cardMaps'][card][1]<=21){
		activePlayer['score']+=blackJackGame['cardMaps'][card][1];
		}
		else{
			activePlayer['score']+=blackJackGame['cardMaps'][card][0];
		}
		
	}
	else{
		activePlayer['score']+=blackJackGame['cardMaps'][card];
	}
	
}
function showScore(activePlayer){
	if(activePlayer['score']>21){
		document.querySelector(activePlayer['scoreSpan']).textContent='BUSTED!!!';
		document.querySelector(activePlayer['scoreSpan']).style.color='red';
	}
	else{
		document.querySelector(activePlayer['scoreSpan']).textContent=activePlayer['score'];
	}
}

function sleep(ms){
	return new Promise(resolve=>setTimeout(resolve,ms));
}

async function dealerLogic(){
if(blackJackGame['deactivate']===false){
	blackJackGame['isStand']=true;
	while(DEALER['score']<16 && blackJackGame['isStand']===true){
		let card=randomcard();
		showCard(card,DEALER);
		updateScore(card,DEALER);
		showScore(DEALER);
		await sleep(1000);
	}
	

	
		blackJackGame['turnsOver']=true;
		let winner=computeWinner();
		showResult(winner);
		blackJackGame['deactivate']=true;
	
}	
}

// compute winner and return who won the game
// update wins losses and draws
function computeWinner(){
	let winner;
	if(YOU['score']<=21){
		// heighr score than dealer or dealer got busted
		if(YOU['score']>DEALER['score'] || (DEALER['score']>21)){
			blackJackGame['wins']++;
			winner=YOU;
		}else if(YOU['score']<DEALER['score']){
			blackJackGame['losses']++;
			winner=DEALER;
		}else if(YOU['score']==DEALER['score']){
			blackJackGame['draws']++;
			console.log('Draw');
		}
	}
	// when user bust but dealer dont
	else if(YOU['score']>21 && DEALER['score']<=21){
		winner=DEALER;
		blackJackGame['losses']++;
	}
	// when both bust
	else if(YOU['score']>21 && DEALER['score']>21){
		console.log('Draw');
		blackJackGame['draws']++;
	}
	return winner;
}

function showResult(winner){
	let message,messageColor;

	if(blackJackGame['turnsOver']===true){


		if(winner===YOU){
			document.querySelector('#wins').textContent=blackJackGame['wins'];
			message='You WON';
			messageColor='green';
			winSound.play();
		}else if(winner===DEALER){
			document.querySelector('#lossses').textContent=blackJackGame['losses'];
			message="You LOST";
			messageColor='red';
			lossSound.play();
		}
		else{
			document.querySelector('#draws').textContent=blackJackGame['draws'];
			message='You DREW';
			messageColor='yellow';
		}

		document.querySelector('#blackjack-result').textContent=message;
		document.querySelector('#blackjack-result').style.color=messageColor;
	}
}