import {
  book_an_appointment,
  create_booking_consultant,
  get_available_slots,
  get_user_bookings,
  reschedule_booking,
} from "@controllers/booking";
import { Router } from "express";

const router = Router();

router.get("/available-slots", get_available_slots);
router.post("/", book_an_appointment);
router.get("/", get_user_bookings);
router.post("/reschedule", reschedule_booking);
router.post("/create-available-slots", create_booking_consultant);

export default router;
