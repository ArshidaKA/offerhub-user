import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import { useGetOrderHistory } from "../../hooks/queries/order";
import LoadingSpinner from "../../components/LoadingSpinner";
import OrderStatus from "./OrderStatus";

const OrderHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data, isLoading } = useGetOrderHistory();
  const orders = data?.orders;

  const handleOrderStatusOpen = (order) => {
    console.log(order, "order");
    setIsOrderStatusOpen(true);

    setSelectedOrder(order);
  };

  const handleOrderStatusClose = () => {
    setIsOrderStatusOpen(false);
  };

  // Filter orders based on the search query
  const filteredOrders = orders?.filter((order) =>
    order.products.some((product) =>
      product?.productId?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  useEffect(() => {
    if (selectedOrder) {
      const updatedSelectedOrder = orders.find(
        (order) => order?._id === selectedOrder?._id
      );
      setSelectedOrder(updatedSelectedOrder);
    }
  }, [orders]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="order-history-section">
            <div className="header-section">
              <div className="title-section">
                <h2>Track Your Orders</h2>
                <p className="subtitle">
                  Easily check the status of your current and past orders. Stay
                  updated on where your order is and what's next!
                </p>
              </div>
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Enter Product Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn">Search</button>
              </div>
            </div>

            <div className="orders-table">
              {filteredOrders?.length === 0 ? (
                <div className="no-orders">
                  <h3>No Orders Found</h3>
                  <p>Try searching with a different product name.</p>
                </div>
              ) : (
                <>
                  <div className="table-header">
                    <div className="product-col">Products</div>
                    <div className="total-col">Total Amount</div>
                    <div className="order-id-col">Order ID</div>
                    <div className="status-col">Status</div>
                    <div className="action-col"></div>
                  </div>
                  <div className="table-body">
                    {filteredOrders.map((order) => (
                      <div key={order._id} className="order-row">
                        <div className="product-col">
                          {order.products.map((product, index) => (
                            <div key={index} className="product-details">
                              <img
                                src={
                                  product.variantId
                                    ? product.variantId.images[0]
                                    : product?.productId?.images[0]
                                }
                                alt={
                                  product.variantId
                                    ? product.variantId.name
                                    : product?.productId?.name
                                }
                              />
                              <div className="info">
                                <h3 title={product?.productId?.name}>
                                  {product?.productId?.name?.length > 30
                                    ? `${product?.productId?.name?.slice(
                                        0,
                                        30
                                      )}...`
                                    : product?.productId?.name}
                                </h3>
                                <div className="product-price">
                                  ₹ {product.price}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="total-col" data-label="Total Amount">
                          <div className="total-amount">
                            ₹{" "}
                            {order?.totalAmount}
                          </div>
                        </div>

                        <div className="order-id-col" data-label="Order ID">
                          <span className="order-id">
                            {order?._id}&nbsp;&nbsp;
                          </span>
                        </div>

                        <div className="status-col">
                          <div className={`status-tag ${order?.status}`}>
                            {order?.status}
                          </div>
                          <div className="delivery-info">
                            {order?.status === "delivered"
                              ? "Delivered on"
                              : "Expected delivery"}
                            <br />
                            {new Date(
                              order?.expectedDelivery
                            ).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="action-col">
                          <button
                            className={`action-btn ${
                              order?.status === "delivered" ? "view" : "track"
                            }`}
                            onClick={() => handleOrderStatusOpen(order)}
                          >
                            {order?.status === "delivered"
                              ? "View"
                              : "Track & Manage"}{" "}
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <OrderStatus
            isOpen={isOrderStatusOpen}
            onClose={handleOrderStatusClose}
            order={selectedOrder}
          />
        </>
      )}
    </>
  );
};

export default OrderHistory;
