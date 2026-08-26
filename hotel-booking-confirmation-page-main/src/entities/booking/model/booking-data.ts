export interface BookingReceipt {
  reservationNumber: string
  hotelCode: string
  checkIn: { date: string; day: string; time: string }
  checkOut: { date: string; day: string; time: string }
  room: { name: string; nights: number; price: number }
  breakfast: { guests: number; price: number }
  touristTax: number
  totalPaid: number
  paymentMethod: string
}

export interface HostNote {
  hostName: string
  message: string
  roomName: string
}

export interface GuestInfoCard {
  number: string
  color: string
  icon: string
  title: string
  subtitle: string
  description: string
}

export const bookingReceipt: BookingReceipt = {
  reservationNumber: 'MS-2026',
  hotelCode: '0421-AH',
  checkIn: { date: '25 Apr', day: 'Saturday', time: '15:00' },
  checkOut: { date: '29 Apr', day: 'Wednesday', time: '11:00' },
  room: { name: 'La Garrigue', nights: 4, price: 620 },
  breakfast: { guests: 2, price: 96 },
  touristTax: 14.40,
  totalPaid: 730.40,
  paymentMethod: 'Paid · Wise · GBP'
}

export const hostNote: HostNote = {
  hostName: 'Margaux',
  message:
    "We're so glad you're coming. The shutters will be open, the lemonade cold, and the cat - Poivre - pretending not to notice you.",
  roomName: 'La Garrigue'
}

export const guestInfoCards: GuestInfoCard[] = [
  {
    number: '01',
    color: 'terracotta-600',
    icon: '🔑',
    title: 'Check-in from 15:00',
    subtitle: 'Sat, 25 April',
    description:
      'Ring the brass bell by the blue door. If we\'re at the market, the key is in the terracotta pot by the olive tree.'
  },
  {
    number: '02',
    color: 'blue-500',
    icon: '📶',
    title: 'Le Soleil · Guest',
    subtitle: 'Password below',
    description: ''
  },
  {
    number: '03',
    color: 'rose-500',
    icon: '☕',
    title: 'Served 8 - 10:30',
    subtitle: 'On the terrace',
    description:
      'Fresh figs, Marseille honey, pain au levain, and espresso. Gluten-free option? Leave a note the night before.'
  }
]

export const wifiNetwork = {
  name: 'Le Soleil · Guest',
  password: 'soleil-2026'
}
