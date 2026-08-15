import { connectDB } from "@/lib/databaseconnection";
import { catchError, response } from "@/lib/helperfunction";
import OrderModel from "@/models/Order.model";

export async function PUT(request) {
  try {
    await connectDB();

    const payload = await request.json();

    console.log("UPDATE STATUS PAYLOAD:", payload);

    const { _id, status } = payload;

    if (!_id || !status) {
      return response(false, 400, "Order id and status are required.");
    }

    const orderData = await OrderModel.findById(_id);

    if (!orderData) {
      return response(false, 404, "Order not found.");
    }

    // Check same status
    if (orderData.orderStatus === status) {
      return response(false, 400, "Order already has this status.");
    }

    // Update status
    orderData.orderStatus = status;

    await orderData.save();

    return response(true, 200, "Order status updated successfully.", {
      _id: orderData._id,
      orderStatus: orderData.orderStatus,
      statusHistory: orderData.statusHistory,
    });
  } catch (error) {
    console.log("STATUS UPDATE ERROR:", error);

    return catchError(error);
  }
}
