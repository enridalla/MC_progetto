// /models/menuModel.js
export const fetchMenus = () => {
    // Simula una chiamata API per caricare i menù
    return [
      {
        id: '1',
        name: 'Pizza Margherita',
        description: 'Pomodoro, mozzarella, basilico fresco.',
        price: '€10.99',
        deliveryTime: '15 minuti',
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '2',
        name: 'Sushi Combo',
        description: '12 pezzi di sushi assortito.',
        price: '€18.50',
        deliveryTime: '20 minuti',
        image: 'https://via.placeholder.com/150',
      },
      {
        id: '3',
        name: 'Burger Classico',
        description: 'Hamburger con patatine fritte.',
        price: '€12.00',
        deliveryTime: '10 minuti',
        image: 'https://via.placeholder.com/150',
      },
    ];
  };
  