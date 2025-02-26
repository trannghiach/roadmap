import { use, useEffect, useState } from 'react';
import { iconRate, weatherMainDistribution } from '../contexts/GeneralContext'

const FightEvent = ({ myChess, enemyChess, onFightEnd, onRunEnd, isMyEnhanced, isEnemyEnhanced }) => {
    const [myPercentage, setMyPercentage] = useState(0);
    const [enemyPercentage, setEnemyPercentage] = useState(0);
    console.log('myPercentage: ', myPercentage);
    console.log('enemyPercentage: ', enemyPercentage);

    const winrate = 100*Math.round(((enemyPercentage/myPercentage) + (isMyEnhanced ? 15/weatherMainDistribution[myChess.main] : 0) - (isEnemyEnhanced ? 15/weatherMainDistribution[enemyChess.main] : 0))*100)/100;
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    console.log('randomNumber: ', randomNumber);
    const meWin =  randomNumber <= winrate*100;
    
    useEffect(() => {
        setMyPercentage(Math.round(iconRate[myChess.icon]*((0.964*0.64)**(myChess.level))*(0.964**(myChess.qty-1))*100)/100);
        setEnemyPercentage(Math.round(iconRate[enemyChess.icon]*((0.964*0.64)**(enemyChess.level))*(0.964**(enemyChess.qty-1))*100)/100);
    }, [myChess, enemyChess]);

    function handleFight() {
        console.log("meWin: ", meWin);
        onFightEnd(meWin);
    }

    function handleRun() {
        onRunEnd();
    }

  return (
    <>
        <div className='flex gap-5 justify-center items-center'>
            <button onClick={handleFight} className='bg-green-500 text-white px-5 py-2 rounded-lg'>Fight</button>
            <button onClick={handleRun} className='bg-red-500 text-white px-5 py-2 rounded-lg'>Run</button>
            <p className='text-2xl font-bold'>Winrate: {winrate}%</p>
        </div>
    </>
  )
}

export default FightEvent;