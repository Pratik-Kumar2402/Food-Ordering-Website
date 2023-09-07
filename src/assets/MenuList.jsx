import React, { useState, useEffect } from 'react';
import './menuList.css';
import data from './dataset.json';

export default function Menu() {
  const [items, setItems] = useState(data);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState([]); // State to store selected meals
  const [totalPrice, setTotalPrice] = useState(0); // State to store the total price

  const filterList = (list) => {
    if (list === 'all') {
      setItems(data);
      setSelectedLabel(null);
    } else {
      const updatedList = data.meals.filter((element) => element.labels.includes(list));
      setItems({ ...data, meals: updatedList });
      setSelectedLabel(list);
    }
  };

  const handleSelectMeal = (mealName, mealPrice, selectedDrinkTitle) => {
    // Calculate the total meal price including the meal and selected drink (if available)
    const mealPriceFloat = parseFloat(mealPrice);
    const selectedDrinkPrice = selectedDrinkTitle
      ? parseFloat(
          items.meals
            .find((item) => item.title === mealName)
            .drinks.find((drink) => drink.title === selectedDrinkTitle).price
        )
      : 0;

    const totalMealPrice = mealPriceFloat + selectedDrinkPrice;

    // Update the total price by adding the total meal price
    setTotalPrice((prevTotal) => parseFloat((prevTotal + totalMealPrice).toFixed(3)));

    // Add the selected meal to the list of selected meals with the drink title (if available)
    setSelectedMeals([
      ...selectedMeals,
      {
        name: mealName,
        price: totalMealPrice,
        selectedDrink: selectedDrinkTitle || 'No Drink Selected', // Use 'No Drink Selected' if no drink is selected
      },
    ]);

    // Update the selected drink title in real-time for the current meal
    const updatedItems = { ...items };
    updatedItems.meals.find((item) => item.title === mealName).selectedDrink = selectedDrinkTitle || 'No Drink Selected';
    setItems(updatedItems);
  };

  const handleDeleteMeal = (index, mealPrice) => {
    // Remove the selected meal at the specified index
    const updatedMeals = [...selectedMeals];
    updatedMeals.splice(index, 1);
    setSelectedMeals(updatedMeals);

    // Update the total price by subtracting the meal price
    setTotalPrice((prevTotal) => parseFloat((prevTotal - mealPrice).toFixed(3)));
  };

  useEffect(() => {
    if (selectedLabel === null) {
      setItems(data);
    }
  }, [selectedLabel]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', padding: '20px' }}>Shopping List</h2>
      <hr />
      <div className='grid'>
        <div className='cards'>
          <div className='card1'>
            <button
              className={`card1-button ${selectedLabel === null ? 'active' : ''}`}
              onClick={() => filterList('all')}
            >
              All
            </button>
            {data.labels.map((item) => (
              <button
                key={item.id}
                className={`card1-button ${selectedLabel === item.id ? 'active' : ''}`}
                onClick={() => filterList(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <hr />
          <div className='card2'>
            {items.meals.map((item) => (
              <div key={item.id} className='card2-div'>
                <div>
                  <img className='card2-image' src={item.img} alt='' />
                </div>
                <div className='card2-details'>
                  <strong>{item.title}</strong>
                  <p>Starter: {item.starter}</p>
                  <p>Desert: {item.desert}</p>
                  <p>
                    Selected Drink: <span>{item.selectedDrink || 'None'}</span>
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <select
                      onChange={(e) => {
                        const selectedDrinkTitle = e.target.value;
                        item.selectedDrink = selectedDrinkTitle; // Update the selected drink in the item
                        setItems({ ...items }); // Trigger a re-render to update the drink title
                      }}
                      style={{ padding: '10px' }}
                    >
                      <option value=''>None</option>
                      {item.drinks &&
                        item.drinks.map((drink) => (
                          <option key={drink.id} value={drink.title}>
                            {drink.title} - ${drink.price}
                          </option>
                        ))}
                    </select>
                    <div style={{ textAlign: 'center' }}>
                      <p>$ {item.price}</p>
                      <button
                        style={{ padding: '5px', width: '100px' }}
                        onClick={() => handleSelectMeal(item.title, item.price, item.selectedDrink)}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='selected-price'>
          <h2 className='selected-heading'>Selected meals</h2>
          <ul className='selected-meals-list'>
            {selectedMeals.map((meal, index) => (
              <li key={index}>
                {meal.name} - {meal.selectedDrink} - ${meal.price}
                <button onClick={() => handleDeleteMeal(index, meal.price)}>Delete</button>
              </li>
            ))}
          </ul>
          <div>
            <h2 className='total-price'>Total Price: ${totalPrice}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
