import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService,
} from "@medusajs/medusa";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import { AppleReceiptEmail } from "../emails/appleemail";

export default async function handleOrderPlaced({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs<Record<string, string>>) {
  console.log("Just testing");
  const sendGridService = container.resolve("sendgridService");
  const orderService: OrderService = container.resolve("orderService");

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const order = await orderService.retrieveWithTotals(data.id, {
    relations: ["items", "shipping_address", "customer", "cart"],
  });

  console.log(order);

  const emailHtml = render(
    <AppleReceiptEmail
      emailoptions={{
        client: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
        created_at: order.created_at.toLocaleDateString(),
        city: order.shipping_address.city,
        paid_total: order.total,
        ordernumber: order.display_id,
        email: order.customer.email,
        subtotal: order.subtotal,
        total: Number(order.total).toFixed(2),
        tax_total: Number(order.tax_total).toFixed(2),
        shipping_total: Number(order.shipping_total).toFixed(2),
        items: order.items.map((item) => ({
          id: item.id,
          thumbnail: item.thumbnail,
          title: item.title,
          quantity: item.quantity,
          original_price: Number(item.unit_price).toFixed(2),
        })),
        shipping_address: `${order.shipping_address.address_1}, ${order.shipping_address.address_2}`,
        order_number: order.display_id,
        phone: order.shipping_address.phone,
        site: "https://samistore.ma",
      }}
    />
  );

  const options = {
    from: "supportclient@samistore.ma",
    to: order.customer.email,
    subject: "Votre Commande chez SamiStore",
    html: emailHtml,
  };

  try {
    await sendGridService.sendEmail({
      templateId: "d-f53a4a49d08f42a2b300de41c66921e5",
      from: "supportclient@samistore.ma",
      to: [
        "saadchraibi+cty2fcleflvvxrvuxm2k@boards.trello.com",
        "saadchraibi85@gmail.com",
      ],
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

    await sendgrid.send(options);
  } catch (error) {
    console.error("Error sending email:", error);
    // Handle the error appropriately
  }
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
  context: {
    subscriberId: "order-placed-handler",
  },
};
