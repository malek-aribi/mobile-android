import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const symbols = ['🍎', '🍌', '🍊', '🍋', '🍇', '🍉', '🥭', '🍍']; // List of symbols for the cards

const generateRandomCards = () => {
  const symbolsCopy = [...symbols, ...symbols]; // Duplicate each symbol to create pairs
  const shuffledSymbols = shuffleArray(symbolsCopy);
  return shuffledSymbols.map((symbol, index) => ({ id: index, symbol, matched: false, flipped: false }));
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newCards = generateRandomCards();
    setCards(newCards);
    setSelectedCardIds([]);
    setMessage('');
  };

  const handleCardPress = (cardId) => {
    if (selectedCardIds.length < 2) {
      const updatedCards = [...cards];
      const selectedCard = updatedCards[cardId];

      if (!selectedCard.flipped) {
        selectedCard.flipped = true;
        setSelectedCardIds([...selectedCardIds, cardId]);

        if (selectedCardIds.length === 1) {
          const firstCard = updatedCards[selectedCardIds[0]];
          if (selectedCard.symbol === firstCard.symbol) {
            selectedCard.matched = true;
            firstCard.matched = true;
            setSelectedCardIds([]);
            setMessage('Match found!');
          } else {
            setMessage('No match. Try again.');
            setTimeout(() => {
              selectedCard.flipped = false;
              firstCard.flipped = false;
              setSelectedCardIds([]);
              setCards(updatedCards);
            }, 1000);
          }
        }

        setCards(updatedCards);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match Game</Text>
      <View style={styles.cardsContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, card.flipped && styles.cardFlipped, card.matched && styles.cardMatched]}
            onPress={() => handleCardPress(card.id)}
            disabled={card.matched}
          >
            <Text style={styles.cardText}>{card.flipped ? card.symbol : '?'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.newGameButton} onPress={startNewGame}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 8,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 24,
  },
  cardFlipped: {
    backgroundColor: 'white',
  },
  cardMatched: {
    backgroundColor: 'green',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  newGameButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
