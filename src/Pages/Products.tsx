import React, { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

// Initial data
export const InitialProducts = [
  {
      "name": "Galaxy S23 Ultra",
      "brand": "Samsung",
      "category": "Smartphone",
      "price": "1,199",
      "description": "SmartPhone",
      "createdAt": "2025-01-10",
      "id": 1
    },
    {
      "name": "Pixel Watch 2",
      "brand": "Google",
      "category": "Smartwatch",
      "price": "349",
      "description": "Smartwatch",
      "createdAt": "2025-01-03",
      "id": 2
    },
    {
      "name": "Sony WH-1000XM5",
      "brand": "Sony",
      "category": "Headphones",
      "price": "399",
      "description": "Headphones",
      "createdAt": "2025-01-15",
      "id": 3
    },
    {
      "name": "MacBook Air M3",
      "brand": "Apple",
      "category": "Laptop",
      "price": "1,099",
      "description": "Laptop",
      "createdAt": "2025-01-09",
      "id": 4
    }

];

type ProductsShowForm = {
  showForm: (product?: ProductDetails) => void
}

type ProductsShowList = {
  showList: () => void,
  product?: ProductDetails
}

type ProductDetails = {
  id: number,
  name: string,
  brand: string,
  category: string,
  price: string,
  description: string,
  createdAt: string
}

export function Products() {
  const [content, setContent] = useState<JSX.Element>(<ProductList showForm={showForm} />)

  function showList() {
    setContent(<ProductList showForm={showForm} />)
  }

  function showForm(product?: ProductDetails) {
    const emptyProduct: ProductDetails = {
      id: 0,
      name: '',
      brand: '',
      category: '',
      price: '',
      description: '',
      createdAt: ''
    }
    setContent(<ProductForm product={product ?? emptyProduct} showList={showList} />)
  }

  return (
    <div className="container my-5">
      {content}
    </div>
  )
}

function ProductList({ showForm }: ProductsShowForm): React.ReactElement {
  const [products, setProducts] = useState<ProductDetails[]>([])

  // Initialize localStorage with initial data if empty
  function initializeProducts() {
    const savedProducts = localStorage.getItem("products");
    if (!savedProducts) {
      localStorage.setItem("products", JSON.stringify(InitialProducts));
      setProducts(InitialProducts);
    } else {
      setProducts(JSON.parse(savedProducts));
    }
  }

  // Load products from localStorage
  function loadProducts() {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }

  useEffect(() => {
    initializeProducts();
  }, [])

  // Delete product
  function deleteProduct(id: number) {
    try {
      const updatedProducts = products.filter(p => p.id !== id);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">List of Products</h2>
      <button onClick={() => showForm()} className="btn btn-primary me-2">Create</button>
      <button onClick={() => loadProducts()} className="btn btn-outline-primary me-2">Refresh</button>
      <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>{product.price}$</td>
                <td>{product.createdAt}</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button 
                    onClick={() => showForm(product)} 
                    type="button" 
                    className="btn btn-primary btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)} 
                    type="button" 
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      </div>
    </>
  )
}

function ProductForm({ showList, product }: ProductsShowList) {
  const [errorMessage, setErrorMessage] = useState<JSX.Element | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    // Convert formData to an Object with proper types
    const productData = {
      id: product?.id || 0,
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as string,
      price: formData.get('price') as string,
      description: formData.get('description') as string,
      createdAt: product?.createdAt || new Date().toISOString().slice(0, 10)
    }

    // Validation
    if (!productData.name || !productData.brand || !productData.category || !productData.price) {
      setErrorMessage(
        <div className="alert alert-warning" role="alert">
          Please provide all the required fields (Name, Brand, Category, Price)!
        </div>
      );
      return;
    }

    // // Validate price is a positive number
    // if (isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
    //   setErrorMessage(
    //     <div className="alert alert-warning" role="alert">
    //       Please enter a valid price!
    //     </div>
    //   );
    //   return;
    // }

    try {
      const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      
      if (productData.id && productData.id !== 0) {
        // Updating existing product
        const updatedProducts = savedProducts.map((p: ProductDetails) => 
          p.id === productData.id ? productData : p
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
      } else {
        // Creating new product
        const newProduct: ProductDetails = {
          ...productData,
          id: Math.max(...savedProducts.map((p: ProductDetails) => p.id), 0) + 1, // Generate unique ID
        };
        
        const updatedProducts = [...savedProducts, newProduct];
        localStorage.setItem("products", JSON.stringify(updatedProducts));
      }

      showList(); // Go back to list
    } catch (error) {
      console.error("Error saving product:", error);
      setErrorMessage(
        <div className="alert alert-danger" role="alert">
          Error saving product. Please try again.
        </div>
      );
    }
  }
  const navigate = useNavigate()
    window.onpopstate = () => {
        navigate("/Products");
}

  return (
    <>
      <h2 className="text-center mb-3">{product?.id ? "Edit Product" : "Create New Product"}</h2>

      <div className="col-lg-6 mx-auto">
        {errorMessage}

        <form onSubmit={(event) => handleSubmit(event)}>
          {product!.id !== 0 && (
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">ID</label>
              <div className="col-sm-8">
                <input 
                  readOnly 
                  className="form-control-plaintext" 
                  title="id" 
                  defaultValue={product!.id} 
                />
              </div>
            </div>
          )}

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">Name</label>
            <div className="col-sm-8">
              <input 
                className="form-control" 
                name="name" 
                defaultValue={product!.name} 
                required 
              />
            </div>
          </div>

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">Brand</label>
            <div className="col-sm-8">
              <input 
                className="form-control" 
                name="brand" 
                defaultValue={product!.brand} 
                required 
              />
            </div>
          </div>

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">Category</label>
            <div className="col-sm-8">
              <select 
                className="form-control" 
                name="category" 
                defaultValue={product!.category}
                required
              >
                <option value="">Select Category</option>
                <option value="Phones">Phones</option>
                <option value="Computers">Computers</option>
                <option value="Accessories">Accessories</option>
                <option value="GPS">GPS</option>
                <option value="Cameras">Cameras</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">Price</label>
            <div className="col-sm-8">
              <input 
                className="form-control" 
                name="price" 
                type="number" 
                step="0.01"
                defaultValue={product!.price} 
                required 
              />
            </div>
          </div>

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">Description</label>
            <div className="col-sm-8">
              <textarea 
                className="form-control" 
                name="description" 
                defaultValue={product!.description}
              />
            </div>
          </div>

          {/* <div className="row mb-3">
            <label className="col-sm-4 col-form-label">Created At</label>
            <div className="col-sm-8">
              <input 
                className="form-control" 
                name="createdAt" 
                type="date"
                defaultValue={product!.createdAt}
                required 
              />
            </div>
          </div> */}

          <div className="row">
            <div className="offset-sm-4 col-sm-4 d-grid">
              <button type="submit" className="btn btn-primary btn-sm me-3">
                Save
              </button>
            </div>
            <div className="col-sm-4 d-grid">
              <button 
                onClick={showList} 
                type="button" 
                className="btn btn-secondary me-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}



// import React, { useEffect, useState, type JSX } from "react";
// import { useNavigate } from "react-router-dom";

// type ProductsShowForm = {
// showForm : (product?: ProductDetails) => void
// }
// type ProductsShowList = {
// showList : () => void,
// product?: ProductDetails
// }
// type ProductDetails = {
//     id: number,
//     title: string,
//     brand: string,
//     category: string,
//     price: number,
//     description: string,
//     createdAt: string
// }
// export function Products () {
//     const [content, setcontent] = useState<JSX.Element>(<ProductList showForm={showForm}/>)

//     function showList () {
//         setcontent(<ProductList showForm= {showForm}/>)
//     }
//     function showForm (product ?: ProductDetails) {
//         const emptyProduct : ProductDetails = {
//             id: 0,
//             title: '',
//             brand: '',
//             category: '',
//             price: 0,
//             description: '',
//             createdAt: ''

//         }
//         setcontent(<ProductForm product = {product ?? emptyProduct} showList = {showList}/>)
//     }
//     return (
//         <div className="container my-5">
//             {content}
//         </div>
//     )
// }

// function ProductList({ showForm }: ProductsShowForm): React.ReactElement {
// const [products, setproducts] = useState<ProductDetails[]>([])

// function fetchProducts () {
//     console.log("🔄 REFRESH: Starting fetchProducts...");

// fetch("https://fakestoreapi.in/api/products")
// .then((Response) => {
//     if(!Response.ok) {
//         throw new Error ("Unexpected server response");
//     } return Response.json() 
// })
// .then((data) => {
//     // setproducts(data.products);
    
//     const deletedIds = JSON.parse(localStorage.getItem("deletedIds") || "[]");
//     const updatedProducts = JSON.parse(localStorage.getItem("updatedProducts") || "{}")

//     // remove items that were deleted locally
//     const filtered = data.products.filter((p : ProductDetails) => !deletedIds.includes(p.id));
//     //update products locally
//     const merged = filtered.map((p: ProductDetails) => ({...p, ...updatedProducts[p.id]}))
//     const newProducts = JSON.parse(localStorage.getItem("newProducts") || "[]");
//     // Add new products created locally  
//     const allProducts = [...merged, ...newProducts];
//     setproducts(allProducts)
// })
//   .catch((error) => {
//     console.error("Error:" , error);
//   });

// }


// useEffect(() => fetchProducts(), [])


// // function deleteProduct(id : number) {
// //     // fetch("http://localhost:3001/products/" + id, {method: "DELETE"})
// //     // .then(response => response.json())
// //     // .then(data => fetchProducts())

// function deleteProduct(id: number) {
//   try {
//         //remember deletion locally
//         const deletedIds = JSON.parse(localStorage.getItem("deletedIds") || "[]");
//         if (!deletedIds.includes(id)) {
//             deletedIds.push(id);
//             localStorage.setItem("deletedIds", JSON.stringify(deletedIds));
//         }

//         // Also remove from newProducts if it exists there
//         const newProducts = JSON.parse(localStorage.getItem("newProducts") || "[]");
//         const filteredNewProducts = newProducts.filter((p: ProductDetails) => p.id !== id);
//         localStorage.setItem("newProducts", JSON.stringify(filteredNewProducts));

//         //remove from state
//         setproducts(prev => prev.filter(p => p.id !== id))
//     } catch (error) {
//         console.error("Error deleting product:", error);
//     }

// }


//     return(
//         <>
//         <h2 className="text-center mb-3">List of Products</h2>
//         <button onClick={() => showForm()} className="btn btn-primary me-2">Create</button>
//         <button onClick={() => fetchProducts()} className="btn btn-outline-primary me-2">Refresh</button>
//         <table className="table">
//             <thead>
//                 <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Brand</th>
//                     <th>Category</th>
//                     <th>Price</th>
//                     {/* <th>CreatedAt</th> */}
//                     <th>Action</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {
//                     products.map((product, index) => {
//                         console.log(product.id);
//                         return (
//                             <tr key={parseInt(product.id.toString(), 10)}>
//                                 {/* <td>{product.id}</td> */}
//                                 <td>{index + 1}</td>
//                                 <td>{product.title}</td>
//                                 <td>{product.brand}</td>
//                                 <td>{product.category}</td>
//                                 <td>{product.price}$</td>
//                                 {/* <td>{product.createdAt}</td> */}
//                                 <td style={{width: "10px", whiteSpace: "nowrap" }}>
//                                     <button onClick={() => showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
//                                     <button onClick={() => deleteProduct(product.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
//                                 </td>
                                
//                             </tr>
//                         )
//                     } )
//                 }
//             </tbody>
//         </table>
//         </>
//     )
// }

// function ProductForm ({showList, product}:ProductsShowList ) {

//     const [errorMessage, seterrorMessage] = useState<JSX.Element | null>(null)
    
//     function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//         event.preventDefault();

//         const form = event.target as HTMLFormElement
//         const formData = new FormData(form)
        
//         //convert formData to an Object with proper types
//         const productData = {
//             id: product?.id || 0,
//             title: formData.get('title') as string,
//             brand: formData.get('brand') as string,
//             category: formData.get('category') as string,
//             price: Number(formData.get('price')),
//             description: formData.get('description') as string,
//             createdAt: product?.createdAt || new Date().toISOString().slice(0, 10)
//         }

//         // Validation
//         if (!productData.title || !productData.brand || !productData.category || !productData.price) {
//             seterrorMessage(
//             <div className="alert alert-warning" role="alert">
//                 Please Provide all the required Fields (Name, Brand, Category, Price)!
//             </div>
//             );
//             return;
//         }

//         // Validate price is a positive number
//         if (isNaN(productData.price) || productData.price <= 0) {
//             seterrorMessage(
//             <div className="alert alert-warning" role="alert">
//                 Please enter a valid price!
//             </div>
//             );
//             return;
//         }

//         try {
//             if (productData.id && productData.id !== 0) {
//                 // Updating existing product
//                 const updatedProducts = JSON.parse(localStorage.getItem("updatedProducts") || "{}");
//                 updatedProducts[productData.id] = productData;
//                 localStorage.setItem("updatedProducts", JSON.stringify(updatedProducts));
//             } else {
//                 // Creating new product
//                 const newProduct: ProductDetails = {
//                     ...productData,
//                     id: Date.now(), // Generate unique ID
//                 };

//                 const newProducts = JSON.parse(localStorage.getItem("newProducts") || "[]");
//                 newProducts.push(newProduct);
//                 localStorage.setItem("newProducts", JSON.stringify(newProducts));
//                 ;
//                 console.log("New products array after adding:", newProducts); // Debug log
                
//                 // Update the products state immediately to show the new product

//             }
            
//             showList(); // Go back to list
//         } catch (error) {
//             console.error("Error saving product:", error);
//             seterrorMessage(
//             <div className="alert alert-danger" role="alert">
//                 Error saving product. Please try again.
//             </div>
//             );
//         }
//     }
    
//     const navigate = useNavigate()
//     window.onpopstate = () => {
//         navigate("/Products");
// }
//     return(
//         <>
//         <h2 className="text-center mb-3">{product?.id ? "Edit Product" : "Create New Product"}</h2>

//         <div className="col-lg-6 mx-auto">

//             {errorMessage}

//             <form onSubmit={(event) => handleSubmit(event)}>
//                 {product!.id && <div className="row mb-3">
//                     <label className="col-sm-4 col-form-label">ID</label>
//                     <div className="col-sm-8">
//                         <input readOnly className="form-control-plaintext" title="id" defaultValue={product!.id }/>
//                     </div>
//                 </div>}
                
//                 <div className="row mb-3">
//                     <label className="col-sm-4 col-form-label">Name</label>
//                     <div className="col-sm-8">
//                         <input className="form-control" name="title" defaultValue={product!.title } />
//                     </div>
//                 </div>
//                 <div className="row mb-3">
//                     <label className="col-sm-4 col-form-label">Brand</label>
//                     <div className="col-sm-8">
//                         <input className="form-control" name="brand" defaultValue={product!.brand } />
//                     </div>
//                 </div>
//                 <div className="row mb-3">
//                     <label className="col-sm-4 col-form-label">Category</label>
//                     <div className="col-sm-8">
//                         <select className="form-control" name="category" defaultValue={product!.category }>
//                             <option value="Other">Other</option>
//                             <option value="Phones">Phones</option>
//                             <option value="Computers">Computers</option>
//                             <option value="Accessories">Accessories</option>
//                             <option value="GPS">GPS</option>
//                             <option value="Cameras">Cameras</option>
//                         </select>
//                     </div>
//                 </div>
//                 <div className="row mb-3">
//                     <label className="col-sm-4 col-form-label">Price</label>
//                     <div className="col-sm-8">
//                         <input className="form-control" name="price" defaultValue={product!.price } />
//                     </div>
//                 </div>
//                 <div className="row mb-3">
//                     <label className="col-sm-4 col-form-label">description</label>
//                     <div className="col-sm-8">
//                         <textarea className="form-control" name="description" defaultValue={product!.description }/>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="offset-sm-4 col-sm-4 d-grid">
//                         <button type="submit" className="btn btn-primary btn-sm me-3">Save</button>
//                     </div>
//                     <div className="col-sm-4 d-grid">
//                       <button onClick={showList} type="button" className="btn btn-secondary me-2">cancel</button>
//                     </div>
//                 </div>

//             </form>
//         </div>
//         </>
//     )
// }

