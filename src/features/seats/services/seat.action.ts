
"use server";

import { revalidatePath } from "next/cache";
import { SeatService } from "./seat.service";
import { BookSeatRequestDto } from "../dto/request/book-seat.dto";
import { ReleaseSeatRequestDto } from "../dto/request/release-seat.dto";

export const bookSeatAction = async (dto: BookSeatRequestDto) => {
  try {
    const result = await SeatService.book(dto);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const releaseSeatAction = async (dto: ReleaseSeatRequestDto) => {
  try {
    const result = await SeatService.release(dto);
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};