import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
// import useProducts from "../../hooks/useProducts";
import { addToDb, getStoredCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [ size, setSize]= useState(10);

  useEffect(()=>{
      fetch(`http://localhost:5000/product?page=${currentPage}&size=${size}`)
      .then(res=>res.json())
      .then(data=>setProducts(data))
  },[currentPage,size]);

  useEffect(()=>{
      fetch('http://localhost:5000/productCount')
      .then(res=>res.json())
      .then(data=>{
          const number = data.count;
          const numbOfPages = Math.ceil(number/size);
          setPages(numbOfPages);
      })
  },[size]);

//   useEffect(() => {
//     const storedCart = getStoredCart();
//     const savedCart = [];
//     for (const id in storedCart) {
//       const addedProduct = products.find((product) => product._id === id);
//       if (addedProduct) {
//         const quantity = storedCart[id];
//         addedProduct.quantity = quantity;
//         savedCart.push(addedProduct);
//       }
//     }
//     setCart(savedCart);
//   }, [products]);

  const handleAddToCart = (selectedProduct) => {
    console.log(selectedProduct);
    let newCart = [];
    const exists = cart.find((product) => product._id === selectedProduct._id);
    if (!exists) {
      selectedProduct.quantity = 1;
      newCart = [...cart, selectedProduct];
    } else {
      const rest = cart.filter(
        (product) => product._id !== selectedProduct._id
      );
      exists.quantity = exists.quantity + 1;
      newCart = [...rest, exists];
    }

    setCart(newCart);
    addToDb(selectedProduct._id);
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
        <div className="pagination">
            {
                [...Array(pages).keys()].map(number=><button onClick={()=>setCurrentPage(number)}

                className={currentPage===number? 'selected' : ""}
                >{number+1}</button>)
            }
            <select onChange={e=>setSize(e.target.value)}>
                <option value="5">5</option>
                <option selected value="10">10</option>
                <option value="20">20</option>
            </select>
        </div>
      </div>
      <div className="cart-container">
        <Cart cart={cart}>
          <Link to="/orders">
            <button>Review Order </button>
          </Link>
        </Cart>
      </div>
    </div>
  );
};

export default Shop;
