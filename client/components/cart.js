import React from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {
  getCartFromServer,
  removeItemFromCart,
  addProductToServCart,
  decreaseInCart,
  submitOrder
} from '../store/cart'
import {Link} from 'react-router-dom'

export class Cart extends React.Component {
  constructor() {
    super()
    this.calTotal = this.calTotal.bind(this)
    this.calQuantity = this.calQuantity.bind(this)
  }

  async componentDidMount() {
    if (this.props.user.id) {
      await this.props.loadCart(this.props.user.id)
    }
  }

  calQuantity(arr) {
    let totalQuantity = arr.reduce((total, item) => {
      return total + item.orderHistory.quantity
    }, 0)

    return totalQuantity
  }

  calTotal(arr) {
    let checkoutTotal = arr.reduce(
      (total, item) => total + item.price * item.orderHistory.quantity,
      0
    )
    return (checkoutTotal / 100).toFixed(2)
  }

  render() {
    let currentCart = this.props.cart
    return (
      <div className="whole-cart">
        {currentCart.length === 0 ? (
          <div className="cart cart-header">Your cart is empty</div>
        ) : (
          <div className="cart cart-header">
            There are{' '}
            {this.props.cart.length ? this.calQuantity(this.props.cart) : 0}{' '}
            products in your cart
          </div>
        )}
        <div>
          {currentCart &&
            currentCart.map(item => {
              return (
                <div
                  className="card mb-3 single-card"
                  style={{maxWidth: '540px'}}
                  key={item.id}
                >
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img
                        src={item.image}
                        className="card-img"
                        alt={item.name}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">
                          Price: ${(item.price / 100).toFixed(2)}
                        </p>
                        <div>
                          <p>
                            Quantity:{' '}
                            <Button
                              variant="dark"
                              size="sm"
                              onClick={() => this.props.decreaseInCart(item.id)}
                            >
                              -
                            </Button>{' '}
                            {item.orderHistory.quantity}{' '}
                            <Button
                              variant="dark"
                              size="sm"
                              onClick={() =>
                                this.props.addProductToServCart(
                                  item.id,
                                  this.props.userId
                                )
                              }
                            >
                              +
                            </Button>
                          </p>
                        </div>
                        <Button
                          variant="dark"
                          onClick={() => this.props.removeFromCart(item.id)}
                        >
                          Remove From Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
        <div className="cart-total">
          Total Due at Checkout: $
          {this.props.cart.length ? this.calTotal(this.props.cart) : 0}
        </div>
        <Button
          variant="dark"
          onClick={() => this.props.submitOrder(this.props.user.id)}
        >
          <Link to="/thankyou">Submit Order</Link>
        </Button>
      </div>
    )
  }
}

const mapState = state => {
  return {
    cart: state.cart,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    loadCart: userId => {
      dispatch(getCartFromServer(userId))
    },
    removeFromCart: itemId => {
      dispatch(removeItemFromCart(itemId))
    },
    addProductToServCart: (itemId, userId) => {
      dispatch(addProductToServCart(itemId, userId))
    },
    decreaseInCart: itemId => {
      dispatch(decreaseInCart(itemId))
    },
    submitOrder: userId => {
      dispatch(submitOrder(userId))
    }
  }
}

export default connect(mapState, mapDispatch)(Cart)
