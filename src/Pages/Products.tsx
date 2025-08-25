import React, { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";

type ProductsShowForm = {
showForm : (product?: ProductDetails) => void
}
type ProductsShowList = {
showList : () => void,
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
export function Products () {
    const [content, setcontent] = useState<JSX.Element>(<ProductList showForm={showForm}/>)

    function showList () {
        setcontent(<ProductList showForm= {showForm}/>)
    }
    function showForm (product ?: ProductDetails) {
        const emptyProduct : ProductDetails = {
            id: 0,
            name: '',
            brand: '',
            category: '',
            price: '',
            description: '',
            createdAt: ''

        }
        setcontent(<ProductForm product = {product ?? emptyProduct} showList = {showList}/>)
    }
    return (
        <div className="container my-5">
            {content}
        </div>
    )
}

function ProductList ({showForm}:ProductsShowForm ) {
const [products, setproducts] = useState<ProductDetails[]>([])

function fetchProducts () {
    fetch("http://localhost:4001/products")  
  .then((response) => {
    if (!response.ok) {
      throw new Error("UnExpected server response");
    }
    return response.json();
  })
  .then((data) => {
    console.debug(data);

    //remove items that were deleted locally
    const deletedIds = JSON.parse(localStorage.getItem("deletedIds") || "[]");
    const filtered = data.filter((p : ProductDetails) => !deletedIds.includes(p.id));
    setproducts(filtered)
})
  .catch((error) => {
    console.error("Error:" , error);
  });

}

useEffect(() => fetchProducts(), [])


function deleteProduct(id : number) {
    // fetch("http://localhost:3001/products/" + id, {method: "DELETE"})
    // .then(response => response.json())
    // .then(data => fetchProducts())

    //remove from state
    setproducts(prev => prev.filter(p => p.id !== id))

    //remember deletion
    const deletedIds = JSON.parse(localStorage.getItem("deletedIds") || "[]");
    localStorage.setItem("deletedIds", JSON.stringify([...deletedIds, id]))
}

    return(
        <>
        <h2 className="text-center mb-3">List of Products</h2>
        <button onClick={() => showForm()} className="btn btn-primary me-2">Create</button>
        <button onClick={() => fetchProducts()} className="btn btn-outline-primary me-2">Refresh</button>
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>CreatedAt</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.map((product, index) => {
                        console.log(product.id);
                        return (
                            <tr key={parseInt(product.id.toString(), 10)}>
                                {/* <td>{product.id}</td> */}
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.createdAt}</td>
                                <td style={{width: "10px", whiteSpace: "nowrap" }}>
                                    <button onClick={() => showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                    <button onClick={() => deleteProduct(product.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
                                </td>
                                
                            </tr>
                        )
                    } )
                }
            </tbody>
        </table>
        </>
    )
}

function ProductForm ({showList, product}:ProductsShowList ) {
    const [errorMessage, seterrorMessage] = useState<JSX.Element | null>(null)
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.target as HTMLFormElement
        const formData = new FormData(form)
        
        //convert formData to an Object
        const product = Object.fromEntries(formData.entries()) as Partial<ProductDetails>
        console.log(product);
        


        // Validation
        if (!product.name || !product.brand || !product.category || !product.price) {
            seterrorMessage(
            <div className="alert alert-warning" role="alert">
                Please Provide all the required Fields!
            </div>
            );
            return;
        }
        if (product.id) {
            //update the product
            fetch("http://localhost:4001/products/" + product.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            })  
            .then((response) => {
                if (!response.ok) {
                throw new Error("UnExpected server response");
                }
                return response.json();
            })
            .then((data) => showList())
            .catch((error) => {
                console.error("Error:" , error);
            });
        } else {
            // Remove id so JSON Server auto-generates numeric id
            delete product.id;

            // Add created date
            product.createdAt = new Date().toISOString().slice(0, 10);
            fetch("http://localhost:4001/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            })  
            .then((response) => {
                if (!response.ok) {
                throw new Error("UnExpected server response");
                }
                return response.json();
            })
            .then((data) => showList())
            .catch((error) => {
                console.error("Error:" , error);
            });
        }
    }
    const navigate = useNavigate()
    window.onpopstate = () => {
        navigate("/Products");
}
    return(
        <>
        <h2 className="text-center mb-3">{product?.id ? "Edit Product" : "Create New Product"}</h2>

        <div className="col-lg-6 mx-auto">

            {errorMessage}

            <form onSubmit={(event) => handleSubmit(event)}>
                {product!.id && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">ID</label>
                    <div className="col-sm-8">
                        <input readOnly className="form-control-plaintext" name="id" defaultValue={product!.id }/>
                    </div>
                </div>}
                
                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Name</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="name" defaultValue={product!.name } />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Brand</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="brand" defaultValue={product!.brand } />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Category</label>
                    <div className="col-sm-8">
                        <select className="form-control" name="category" defaultValue={product!.category }>
                            <option value="Other">Other</option>
                            <option value="Phones">Phones</option>
                            <option value="Computers">Computers</option>
                            <option value="Accessories">Accessories</option>
                            <option value="GPS">GPS</option>
                            <option value="Cameras">Cameras</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Price</label>
                    <div className="col-sm-8">
                        <input className="form-control" name="price" defaultValue={product!.price } />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Description</label>
                    <div className="col-sm-8">
                        <textarea className="form-control" name="description" defaultValue={product!.description }/>
                    </div>
                </div>
                <div className="row">
                    <div className="offset-sm-4 col-sm-4 d-grid">
                        <button type="submit" className="btn btn-primary btn-sm me-3">Save</button>
                    </div>
                    <div className="col-sm-4 d-grid">
                      <button onClick={showList} type="button" className="btn btn-secondary me-2">cancel</button>
                    </div>
                </div>

            </form>
        </div>
        </>
    )
}