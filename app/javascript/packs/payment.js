// import "@braintree"
// import "braintree-web";
// import braintreeDefault, * as braintree from "braintree-web";
import braintreeDropIn from "braintree-web-drop-in";

// console.log({ braintreeDefault, braintree, braintreeDropInDefault, braintreeDropIn })
// import "braintree-web-drop-in/dist/browser/dropin";
// import { dropin } from "braintree-web-drop-in/dist/browser/dropin.js";
// import { dropin } from "braintree-web";
// import { dropin } from "braintree-web-drop-in";

document.addEventListener("turbolinks:load", function() {

  if (document.querySelector("#submit-button")) {
  
    const button = document.querySelector("#submit-button");
    const dropinContainer = document.querySelector("#dropin-container");
    const token = dropinContainer.dataset.token;
    
    console.log(token)
    braintreeDropIn.create(
      {
        authorization: token,
        container: dropinContainer
      }, 
      
      function(createErr, instance) {
        console.log({ createErr, instance })
        button.addEventListener("click", function(e) {
          e.preventDefault();
          instance.requestPaymentMethod(function(err, payload) {
            const form = document.querySelector("#payment_form");
            const nonce_dom = document.querySelector("#nonce");
            nonce_dom.value = payload.nonce;
            form.submit();
          });
        });
      } 
    );

  }

});