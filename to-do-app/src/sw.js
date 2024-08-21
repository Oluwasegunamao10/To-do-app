self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  clients.openWindow("/");
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "path/to/icon.png",
  });
});
