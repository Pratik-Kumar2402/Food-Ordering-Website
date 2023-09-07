import React, { useState, useEffect } from 'react';
import './menuList.css';
import data from './dataset.json';

export default function Menu() {
  // Define states using the useState hook
  const [items, setItems] = useState(data);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Function to filter the list of meals based on the selected label
  const filterList = (list) => {
    if (list === 'all') {
      setItems(data);
      setSelectedLabel(null);
    } else {
      // Filter the list based on the selected label
      const updatedList = data.meals.filter((element) => element.labels.includes(list));
      setItems({ ...data, meals: updatedList });
      setSelectedLabel(list);
    }
  };

  // Function to handle the selection of a meal
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

    setTotalPrice((prevTotal) => parseFloat((prevTotal + totalMealPrice).toFixed(3)));

    // Add the selected meal to the list of selected meals with the drink title (if available)
    setSelectedMeals([
      ...selectedMeals,
      {
        name: mealName,
        price: totalMealPrice,
        selectedDrink: selectedDrinkTitle || 'No Drink Selected',
      },
    ]);

    // Update the selected drink title in real-time for the current meal
    const updatedItems = { ...items };
    updatedItems.meals.find((item) => item.title === mealName).selectedDrink = selectedDrinkTitle || 'No Drink Selected';
    setItems(updatedItems);
  };

  // Function to handle the deletion of a selected meal
  const handleDeleteMeal = (index, mealPrice) => {
    const updatedMeals = [...selectedMeals];
    updatedMeals.splice(index, 1);
    setSelectedMeals(updatedMeals);

    setTotalPrice((prevTotal) => parseFloat((prevTotal - mealPrice).toFixed(3)));
  };

  // useEffect to reset the items list when "All" is selected
  useEffect(() => {
    if (selectedLabel === null) {
      setItems(data);
    }
  }, [selectedLabel]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', padding: '20px' }}>Have A Nice Day With A Perfect Meal For You</h2>
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
            {/* Buttons to filter items based on labels */}
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