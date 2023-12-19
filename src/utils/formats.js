import moment from 'moment/moment'

export function formatNumber(value) {
    const val = (value / 1).toFixed().replace(".", ",");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

export function formatDate(inputFormat, format = 'DD-MM-YYYY HH:mm:ss') {
  if (inputFormat) {
    return moment(inputFormat).format(format)
  }
}
  