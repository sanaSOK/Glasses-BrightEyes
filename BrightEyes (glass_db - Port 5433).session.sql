INSERT INTO cart_items (
    id,
    cartId,
    productId,
    quantity,
    price,
    subtotal,
    createdAt,
    updatedAt
  )INSERT INTO carts (id, retailerId, createdAt, updatedAt)
  VALUES (
      'id:text',
      'retailerId:text',
      'createdAt:timestamp without time zone',
      'updatedAt:timestamp without time zone'
    );
VALUES (
    'id:text',
    'cartId:text',
    'productId:text',
    quantity:integer,
    'price:double precision',
    'subtotal:double precision',
    'createdAt:timestamp without time zone',
    'updatedAt:timestamp without time zone'
  );