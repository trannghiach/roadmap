import { use, useEffect, useState } from 'react';
import { iconRate, weatherMainDistribution } from '../contexts/GeneralContext'

const FightEvent = ({ myChess, enemyChess, onFightEnd, onRunEnd, isMyEnhanced, isEnemyEnhanced }) => {
    const [myPercentage, setMyPercentage] = useState(0);
    const [enemyPercentage, setEnemyPercentage] = useState(0);

    console.log('myPercentage: ', myPercentage);
    console.log('enemyPercentage: ', enemyPercentage);

    const winrate = 100*Math.round(((enemyPercentage/(myPercentage+enemyPercentage))
        + (isMyEnhanced ? 0.15/weatherMainDistribution[myChess.main] : 0) 
        - (isEnemyEnhanced ? 0.15/weatherMainDistribution[enemyChess.main] : 0))*10000)/10000;
    
    useEffect(() => {
        let ignore = false;
        
        const updatePercentages = () => {
            
            const myPercent = Math.round(iconRate[myChess.icon] * ((0.64) ** (Math.floor(Math.cbrt(myChess.qty)))) * (0.964 ** (myChess.qty - Math.floor(Math.cbrt(myChess.qty)))) * 10000) / 10000;
            const enemyPercent = Math.round(iconRate[enemyChess.icon] * ((0.964 * 0.64) ** (Math.floor(Math.cbrt(enemyChess.qty)))) * (0.964 ** (enemyChess.qty - Math.floor(Math.cbrt(enemyChess.qty)))) * 10000) / 10000;

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
        if(winrate < 55){
            onRunEnd('run');
        } else {
            onRunEnd('skip');
        }
    }

    // TODO: fix this part, it causes the bug that step 3 waves successively
    useEffect(() => {
        if(myChess.locked > 0) {
            onRunEnd('skip');
        }
    }, [myChess]);

  return (
    <>
        <div className='flex gap-5 justify-center items-center border border-gray-300 py-2 px-3 rounded-lg'>
            <button onClick={handleFight} className='bg-green-500 text-white px-5 py-2 rounded-lg'>Fight</button>
            <button onClick={handleRun} 
                    className={`${winrate < 55 ? 'bg-red-500' : 'bg-cyan-500' } text-white px-5 py-2 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed`}
                    disabled={myChess.limit <= 0 && winrate < 55}>
                        {winrate < 55 ? `Run (${myChess.limit} left)` : 'Skip'}
            </button>
            <p className='text-2xl font-bold'>Winrate: {winrate}%</p>
        </div>
    </>
  )
}

export default FightEvent;