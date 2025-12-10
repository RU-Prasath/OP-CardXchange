// components/Cart/Cart.tsx
import { Icon } from '@iconify/react';
import { useCart } from '../../../../context/CartContext';
import { API_BASE_URL } from '../../../../api/clients/axiosClient';

export default function Cart() {
  const { 
    cart, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    // updateQuantity,
    totalItems,
    totalPrice 
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={closeCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1c1c1c] via-[#0a0a0a] to-[#1c1c1c] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#c0392b] via-[#fdd18e] to-[#0097a7] animate-spin-slow"></div>
                <div className="absolute inset-1 rounded-full bg-[#1c1c1c] flex items-center justify-center">
                  <Icon icon="mdi:cart" className="text-[#fdd18e] text-lg" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Treasure Chest</h2>
                <p className="text-sm text-gray-300">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Icon icon="mdi:close" className="text-white text-xl" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 rounded-full bg-[#f6f2ee] flex items-center justify-center mb-6">
                <Icon icon="mdi:treasure-chest-open" className="text-4xl text-[#0097a7]" />
              </div>
              <h3 className="text-xl font-bold text-[#1c1c1c] mb-2">Your Treasure Chest is Empty</h3>
              <p className="text-gray-600 max-w-sm mb-6">
                Add some legendary One Piece cards to start your collection!
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-3 bg-linear-to-r from-[#0097a7] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-[#f6f2ee] rounded-xl">
                  {/* Item Image */}
                  <div className="relative w-20 h-20 shrink-0">
                    <img
                      src={`${API_BASE_URL}${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#c0392b] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {item.quantity}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#1c1c1c] truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{item.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-[#0097a7]/10 text-[#0097a7] rounded-full">
                            {item.condition}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      >
                        <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="font-bold text-lg text-[#c0392b]">
                        ₹{item.price.toLocaleString()}
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Icon icon="mdi:minus" className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Icon icon="mdi:plus" className="w-4 h-4" />
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold text-[#1c1c1c]">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="text-[#0097a7] font-medium">FREE</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-[#1c1c1c]">Total</span>
                  <span className="text-2xl font-bold bg-linear-to-r from-[#0097a7] to-[#c0392b] bg-clip-text text-transparent">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <button className="w-full py-3 bg-linear-to-r from-[#c0392b] via-[#c0392b] to-[#1c1c1c] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300">
                  Proceed to Checkout
                </button>
                <button
                  onClick={closeCart}
                  className="w-full py-3 border border-[#0097a7] text-[#0097a7] font-semibold rounded-lg hover:bg-[#0097a7]/10 transition-colors mt-3"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}