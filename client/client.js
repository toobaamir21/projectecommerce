const button = document.querySelector("button");
button.addEventListener("click", () => {
  console.log("button");
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZDdhNjIyOTYtNWVkNi00MDFlLWJhNjUtZmE1YmY5NmY3ZGIwIiwiaWF0IjoxNzMyNTY2ODg3LCJleHAiOjE3MzI2NTMyODd9.h_kP3Br5JV_0rrQodJ0qhzGMPrrUDFF92YVcFh3M8QY";

  fetch("http://localhost:3000/checkout/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: [
        { id: "a22626d6-b795-4a65-8ede-180db48f2044", quantity: 3 },
        { id: "94bd5eb7-a3e9-4cda-b9c8-110cfece79b1", quantity: 1 },
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
