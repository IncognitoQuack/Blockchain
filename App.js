import React, { useState } from 'react';
import './App.css';
import web3 from './web3';
import coinFlip from './coinflip';

function App() {
  const [bet, setBet] = useState('');
  const [guess, setGuess] = useState('heads');
  const [message, setMessage] = useState('');
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState('');

  const checkContractBalance = async () => {
    const balance = await coinFlip.methods.getContractBalance().call();
    console.log(`Contract balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setMessage('Flipping the coin...');
    setFlipping(true);
    setResult('');

    try {
      await checkContractBalance();  // Check the contract balance before flipping

      const result = await coinFlip.methods.flipCoin(guess === 'heads').send({
        from: accounts[0],
        value: web3.utils.toWei(bet, 'ether'),
        gas: 500000,  // Increased gas limit
      });

      setFlipping(false);

      if (result.events.FlipResult.returnValues.won) {
        setMessage('Congratulations! You won!');
      } else {
        setMessage('Sorry, you lost.');
      }
    } catch (err) {
      console.error(err);
      setFlipping(false);
      setMessage(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className="app">
      <h1>Coin Flip Game</h1>
      <div className={`coin ${flipping ? 'flipping' : ''}`}>
        <div className="heads"></div>
        <div className="tails"></div>
      </div>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label>Bet Amount (in ETH):</label>
          <input
            type="number"
            value={bet}
            onChange={(event) => setBet(event.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Your Guess:</label>
          <select value={guess} onChange={(event) => setGuess(event.target.value)}>
            <option value="heads">Heads</option>
            <option value="tails">Tails</option>
          </select>
        </div>
        <button type="submit" className="button">Flip Coin</button>
      </form>
      <h3>{message}</h3>
      {result && <div className="result">{result}</div>}
    </div>
  );
}

export default App;
