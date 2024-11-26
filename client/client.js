const button = document.querySelector("button");
button.addEventListener("click", () => {
  console.log("button");
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiN2ZkNzhjZGQtNzk2OC00N2U1LWIyZmEtNDI3YTRkNDIxMDczIiwiaWF0IjoxNzMyNjA4NDc5LCJleHAiOjE3MzI2OTQ4Nzl9.3g9mSOogDkt__XDyPRoQxXADKZGK7Sk7MbGd_rJRkdY";

  fetch("http://localhost:3000/checkout/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: [
        { id: "105b43b3-dc30-40c0-85e7-3cc9c4439e5a", quantity: 3 },
        { id: "11d731af-ca8e-44b7-9f58-226db0f7a373", quantity: 1 },
      ],
      name: "Tooba",
      address: "North Nazimabad",
      contact: "7687564353",
      paymentmode: "card",
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      return res.json().then((json) => Promise.reject(json));
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch((e) => {
      console.error(e.error);
    });
});
