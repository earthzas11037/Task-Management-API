export const getHourAndMinute = (minute: number) => {
  return {
    hour: Math.floor(minute / 60),
    minute: minute % 60,
  };
};

export const formatThaiIDCard = (id: string): string => {
  if (id.length !== 13 || !/^\d+$/.test(id)) {
    return id;
    throw new Error('Invalid Thai ID Card number');
  }
  return `${id.slice(0, 1)}-${id.slice(1, 5)}-${id.slice(5, 10)}-${id.slice(10, 12)}-${id.slice(12)}`;
};

export function convertThaiPhoneNumber(phone: string): string {
  if (phone.startsWith('+668')) {
    return '08' + phone.slice(4);
  }
  return phone; // Return as is if not in +668xx format
}

export const formatNumberWithComma = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
