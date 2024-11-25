const button = document.querySelector("button");
button.addEventListener("click", () => {
  console.log("button");
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiN2ZkNzhjZGQtNzk2OC00N2U1LWIyZmEtNDI3YTRkNDIxMDczIiwiaWF0IjoxNzMyNDU3NDM1LCJleHAiOjE3MzI1NDM4MzV9.VvPlW6UlXS4gl8G19qgVGjnXampyRrJC2UQO6zckkQY";

  fetch("http://localhost:3000/checkout/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: [
        { id: "64c3b2d0-34a6-4b18-be31-9d8552c4f77d", quantity: 3 },
        { id: "6537a0a3-0a94-427a-9e82-ab11821808b0", quantity: 1 },
        {
          name: "Tooba",
          address: "North Nazimabad",
          contact: "7687564353",
          paymentmode: "card",
        },
      ],
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
