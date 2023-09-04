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

const handleSelectMeal = (mealName, mealPrice) => {
    // Add the selected meal to the list of selected meals
    setSelectedMeals([...selectedMeals, { name: mealName, price: mealPrice }]);
    // Update the total price by adding the meal price
    setTotalPrice((prevTotal) => parseFloat((prevTotal + mealPrice).toFixed(3)));
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
    <div style={{ backgroundColor: 'beige', height: '100vh' }}>
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
                <p>Selected drink: </p>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '55%'}}>
                    {item.drinks &&
                        item.drinks.map((drink) => (
                        <button key={drink.id} style={{ padding: '18px 11px' }}>
                            {drink.title}
                        </button>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                    <p>$ {item.price}</p>
                    <button
                        style={{ padding: '5px', width: '100px' }}
                        onClick={() => handleSelectMeal(item.title, item.price)}
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
                {meal.name} - ${meal.price}
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
