import { use, useEffect, useState } from 'react';
import { iconRate, weatherMainDistribution } from '../contexts/GeneralContext'

const FightEvent = ({ myChess, enemyChess, onFightEnd, onRunEnd, isMyEnhanced, isEnemyEnhanced }) => {
    const [myPercentage, setMyPercentage] = useState(0);
    const [enemyPercentage, setEnemyPercentage] = useState(0);

    console.log('myPercentage: ', myPercentage);
    console.log('enemyPercentage: ', enemyPercentage);

    const winrate = 100*Math.round(((enemyPercentage/myPercentage) 
        + (isMyEnhanced ? 0.15/weatherMainDistribution[myChess.main] : 0) 
        - (isEnemyEnhanced ? 0.15/weatherMainDistribution[enemyChess.main] : 0))*10000)/10000;
    
    useEffect(() => {
        let ignore = false;
        
        const updatePercentages = () => {
            
            const myPercent = Math.round(iconRate[myChess.icon] * ((0.964 * 0.64) ** (Math.floor(myChess.qty/3))) * (0.964 ** (myChess.qty % 3)) * 10000) / 10000;
            const enemyPercent = Math.round(iconRate[enemyChess.icon] * ((0.964 * 0.64) ** (Math.floor(enemyChess.qty/3))) * (0.964 ** (enemyChess.qty % 3))*10000)/10000;

            if(!ignore) {
                setMyPercentage(myPercent);
                setEnemyPercentage(enemyPercent);
            }
        }

        updatePercentages();

        return () => ignore = true; 
    }, [myChess, enemyChess]);

    function handleFight() {
        
        const randomNumber = Math.floor(Math.random() * 10000) + 1;
        console.log('randomNumber: ', randomNumber);
    
        const meWin =  randomNumber <= winrate*100;

        console.log("meWin: ", meWin);
        onFightEnd(meWin);
    }

    function handleRun() {
        if(winrate < 100){
            onRunEnd('run');
        } else {
            onRunEnd('skip');
        }
    }

    // TODO: fix this part, it causes the bug that step 3 waves successively
    if(myChess.locked > 0) {
        onRunEnd('skip');
    }

  return (
    <>
        <div className='flex gap-5 justify-center items-center'>
            <button onClick={handleFight} className='bg-green-500 text-white px-5 py-2 rounded-lg'>Fight</button>
            <button onClick={handleRun} 
                    className='bg-red-500 text-white px-5 py-2 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed' 
                    disabled={myChess.limit <= 0}>
                        Run ({myChess.limit} left)
            </button>
            <p className='text-2xl font-bold'>Winrate: {winrate}%</p>
        </div>
    </>
  )
}

export default FightEvent;