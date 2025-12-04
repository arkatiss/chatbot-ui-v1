import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  dateval: string | any;
  dateval2: string | any;
  transform(value: any): string {
    if (!(value instanceof Date)) {
      value = new Date(value);
    }
    const myDate = new Date();
    const seconds: number = Math.floor(
      (new Date().getDate() - value.getDate()) / 1000
    );
    let interval: number = Math.floor(seconds / 31536000);
    this.dateval = new Date().toISOString().slice(0, 10);
    const formatdate = this.formatDate(value);

    if (interval > 1) {
      return (
        Math.floor(interval) +
        (Math.floor(interval) === 1 ? 'year ago' : 'years ago')
      );
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        (Math.floor(interval) === 1 ? 'month ago' : 'months ago')
      );
    }
    interval = seconds / 86400;

    if (interval > 1) {
      return (
        Math.floor(interval) +
        (Math.floor(interval) === 1 ? 'day ago' : 'days ago')
      );
    }
    interval = seconds / 3600;
    if (interval > 1) {
      if (formatdate === this.dateval) {
        return 'Today';
      } else {
        return (
          Math.floor(interval) +
          (Math.floor(interval) === 1 ? 'hour ago' : 'hours ago')
        );
      }
    }
    interval = seconds / 60;
    if (interval > 1) {
      return (
        Math.floor(interval) +
        (Math.floor(interval) === 1 ? 'minute ago' : 'minutes ago')
      );
    }
    return Math.floor(seconds) + ' seconds ago';
  }

  formatDate(date: any): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
