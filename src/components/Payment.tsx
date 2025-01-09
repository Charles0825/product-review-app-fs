import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";

const Payment: React.FC = () => {
  const { price } = useParams<{ price: string }>();
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "cash">(
    "credit"
  );
  const [transactionCode] = useState<string>(
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [formErrors, setFormErrors] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (price) {
      // Handle price if necessary
    }
  }, [price]);

  const handleCopy = () => {
    navigator.clipboard.writeText(transactionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const validateForm = () => {
    const errors = { cardNumber: "", expirationDate: "", cvv: "" };
    let valid = true;

    const cardNumberRegex = /^\d{13,16}$/;
    if (!cardNumber.match(cardNumberRegex)) {
      errors.cardNumber = "Card number must be between 13 to 16 digits.";
      valid = false;
    }

    const expirationRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const today = new Date();
    const [month, year] = expirationDate.split("/").map((num) => parseInt(num));
    const expirationDateObj = new Date(`20${year}-${month}-01`);
    if (!expirationDate.match(expirationRegex)) {
      errors.expirationDate = "Invalid expiration date format.";
      valid = false;
    } else if (expirationDateObj < today) {
      errors.expirationDate = "Expiration date cannot be in the past.";
      valid = false;
    }

    const cvvRegex = /^\d{3}$/;
    if (!cvv.match(cvvRegex)) {
      errors.cvv = "CVV must be 3 digits.";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setPaymentSuccess(true);
    } else {
      console.log("Please correct the errors in the form.");
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex flex-col">
        <div className="container mx-auto">
          <Navbar />
        </div>
        <div className="flex justify-center items-center flex-grow pt-16">
          <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-center">Payment</h2>

              {paymentSuccess && (
                <div role="alert" className="alert alert-success">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Your purchase has been confirmed!</span>
                </div>
              )}

              {copied}

              <div className="space-y-4">
                <div>
                  <label className="label cursor-pointer">
                    <span className="label-text">Pay with Credit Card</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="radio"
                      checked={paymentMethod === "credit"}
                      onChange={() => setPaymentMethod("credit")}
                    />
                  </label>
                </div>
                <div>
                  <label className="label cursor-pointer">
                    <span className="label-text">Pay with Cash</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="radio"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                    />
                  </label>
                </div>
              </div>

              {paymentMethod === "credit" ? (
                <div>
                  <p className="text-sm mt-4">
                    Enter your credit card details:
                  </p>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="input input-bordered w-full my-2"
                  />
                  {formErrors.cardNumber && (
                    <p className="text-red-500 text-sm">
                      {formErrors.cardNumber}
                    </p>
                  )}
                  <input
                    type="text"
                    placeholder="Expiration Date (MM/YY)"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="input input-bordered w-full my-2"
                  />
                  {formErrors.expirationDate && (
                    <p className="text-red-500 text-sm">
                      {formErrors.expirationDate}
                    </p>
                  )}
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="input input-bordered w-full my-2"
                  />
                  {formErrors.cvv && (
                    <p className="text-red-500 text-sm">{formErrors.cvv}</p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm mt-4">Your transaction code is:</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={transactionCode}
                      readOnly
                      className="input input-bordered w-full my-2"
                    />
                    <button
                      onClick={handleCopy}
                      className="btn btn-sm btn-primary"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                  </div>
                  <p className="text-sm mt-2">
                    Please pay the amount of {price} at the counter using this
                    code.
                  </p>
                </div>
              )}

              <div className="card-actions justify-end mt-4">
                {paymentSuccess ? (
                  <Link to="/" className="btn btn-block btn-primary">
                    Close
                  </Link>
                ) : paymentMethod === "cash" ? (
                  <Link to="/" className="btn btn-block btn-primary">
                    Close
                  </Link>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn btn-block btn-primary"
                  >
                    Pay {price}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
