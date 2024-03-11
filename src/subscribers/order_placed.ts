import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService,
} from "@medusajs/medusa";
import { relative } from "path";

export default async function handleOrderPlaced({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs<Record<string, string>>) {
  console.log("Just testing");
  const sendGridService = container.resolve("sendgridService");
  const orderService: OrderService = container.resolve("orderService");

  const order = await orderService.retrieveWithTotals(data.id, {
    relations: ["items", "shipping_address", "customer", "cart"],
  });

  console.log(order);
  sendGridService.sendEmail({
    templateId: "d-f53a4a49d08f42a2b300de41c66921e5",
    from: "supportclient@samistore.ma",
    to: [
      "saadchraibi+cty2fcleflvvxrvuxm2k@boards.trello.com",
      "saadchraibi85@gmail.com",
    ],
    // to: "inbox@espacedetravailuserb61fb4da28d5191afe9c6d68e6701a7c.sendboard.com",

    dynamic_template_data: {
      client: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
      paid_total: order.total,
      ordernumber: order.display_id,
      email: order.customer.email,
      subtotal: order.subtotal,
      total: order.total,
      tax_total: order.tax_total,
      shipping_total: order.shipping_total,
      items: order.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        discounted_price: item.discount_total,
      })),
      shipping_address: `${order.shipping_address.address_1}, ${order.shipping_address.address_2} ${order.shipping_address.city}, ${order.shipping_address.postal_code}, ${order.shipping_address.country_code}`,
      order_number: order.display_id,
      phone: order.shipping_address.phone,
      site: "https://samistore.ma",
    },
  });
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
  context: {
    subscriberId: "order-placed",
  },
};
