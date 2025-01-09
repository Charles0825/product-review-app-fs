import ProductDetails from "./components/ProductDetails.tsx";
import ProductListing from "./components/ProductListing.tsx";
import Payment from "./components/Payment.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <ProductListing />,
    },
    {
      path: "/:categoryId/products/:productId",
      element: <ProductDetails />,
    },
    {
      path: "/payment/:price",
      element: <Payment />,
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={route} />
    </div>
  );
}

export default App;
