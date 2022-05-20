import React from "react";
import { useState, useEffect } from "react";
import { CustomerStatements } from "./CustomerStatements";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";


export const CustomerDetail = (props) => {
  
  // loadings
  const [statementsloading, setStatementsLoading] = useState(false);
  const [customerloading, setCustomerLoading] = useState(false);
  
  // Customer Details
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    function filteredCustomer(data) {
      return (
        parseInt(data.Account_No) === parseInt(localStorage.getItem("acc"))
      );
    }

    async function Customers() {
      var filtered = await props.customersDetails.filter(filteredCustomer);
      setCustomer(filtered);
      setCustomerLoading(true);
    }
    Customers();
  }, [props.customersDetails]);

  // Transaction Statements
  const [statements, setStatements] = useState();

  useEffect(() => {
    function FilterStatements(data) {
      return (
        (parseInt(data.Credited_by) === parseInt(localStorage.getItem("acc")) || parseInt(data.Debated_to) === parseInt(localStorage.getItem("acc")))
      );
    }

    async function Statements() {
      var filteredStatements = await props.transactionDetails.filter(FilterStatements);
      console.log(filteredStatements)
      setStatements(filteredStatements);
      setStatementsLoading(true);
    }
    Statements();
  }, [props.transactionDetails]);

  if (props.currentCustomer) {
    localStorage.setItem("acc", props.currentCustomer);
  }
  if (localStorage.getItem("acc")) {
    return (
      <>
        <div className="mt-6 notification mx-2 is-success is-light title has-text-centered">
          Customer Detail
          <hr className="has-background-success" />
        </div>

        <div className="columns is-centered is-touch">
          <div className="column is-6 is-full-mobile">
            <div className="notification mx-2 is-light title is-size-6-touch is-size-5-desktop has-text-left">
              {!customerloading ? (
                  <BeatLoader loading color="orange" size={48} />
              ):(
                customer.map((customer) => {
                  return (
                    
                    <div key={customer._id}>
                      <div className="m-2">
                        <b>Account Number :</b> {customer.Account_No}
                      </div>
                      <div className="m-2">
                        <b>Account Holder Name :</b> {customer.name}
                      </div>
                      <div className="m-2">
                        <b> Account Holder Email :</b> {customer.email}
                      </div>
                      <div className="m-2">
                        <b> Account Balance : </b> ₹{customer.balance}
                      </div>
                      <Link
                        to="/transfer-amount"
                        className="button is-link is-fullwidth mt-4"
                        onClick={() =>
                          props.setTransfer(parseInt(localStorage.getItem("acc")))
                        }
                      >
                        Transfer Amount
                      </Link>
                    </div>
                  );
                })
                
              )}
              
            </div>
          </div>
        </div>

        <div className="notification mx-2 is-info is-light title has-text-centered">
          Statements
          <hr className="has-background-info" />
        </div>
        <div className="columns mt-6 notification is-light mx-2 is-mobile is-multiline" style={{justifyContent: 'center'}}>
          <div className="column is-12">
            <div className="columns notification has-text-centered is-mobile is-dark p-0">
              <div className="column is-2 px-0">
                <h3 className="title is-size-6-touch is-size-3-desktop">
                  Date
                </h3>
              </div>
              <div className="column is-6 px-0">
                <h3 className="title is-size-6-touch is-size-3-desktop">
                  Description
                </h3>
              </div>
              <div className="column is-2 px-0">
                <h3 className="title is-size-6-touch is-size-3-desktop">Credited(₹)</h3>
              </div>
              <div className="column is-2 px-0">
                <h3 className="title is-size-6-touch is-size-3-desktop">Debited(₹)</h3>
              </div>
            </div>
            <hr className="has-background-dark" />
            <hr className="has-background-dark" />
          </div>

          {!statementsloading ? (
              <>
              <BeatLoader loading color="orange" size={72} />
              </>
            ):(
              statements.length === 0 ? (
                <div className="has-background-danger column is-12 has-text-centered title is-size-6-touch is-size-4-desktop">
                  No Transaction Yet
                </div>
              ) : (
                statements.map((transactions) => {
                  return (
                    <CustomerStatements
                      key={transactions._id}
                      statements={transactions}
                      user={parseInt(localStorage.getItem("acc"))}
                    />
                  );
                })
              )
            )}

          
        </div>
      </>
    );
  } else {
    return <div></div>;
  }
};
