import {DIRECTIONS} from "../js/constants";

export type Trip = {
    direction: DIRECTIONS,
    date: string,
    departureTime: string,
    freeSeats: number,
    price: number,
    agent: string
}
