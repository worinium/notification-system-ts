import moment from "moment";

export const filterTypes: { [key: string]: string } = { 'Read': 'Read', 'Unread': 'Unread', 'Important': 'Important', 'All': 'All', 'Search': 'Search' };
export interface NotificationInterface {
    id: number;
    subject: string;
    body: string;
    timeSent: string;
    isImportant: boolean;
    isRead: boolean;
    isSelected?: boolean;
}


export class Notification {
    id: number;
    private _subject: string;
    private _body: string;
    private _timeSent: Date;
    private _isImportant: boolean;
    private _isRead: boolean;
    isSelected: boolean | undefined;

    constructor(notification: NotificationInterface) {
        this.id = notification.id;
        this._subject = notification.subject;
        this._body = notification.body;
        this._timeSent = new Date(notification.timeSent);
        this._isImportant = notification.isImportant;
        this._isRead = notification.isRead;
        this.isSelected = notification.isSelected
    }

    get subject(){
        return this._subject;
    }

    get body(){
        return this._body;
    }

    get isImportant(){
        return this._isImportant;
    }

    get isRead(){
        return this._isRead
    }

    get timeSent(){
        return this._timeSent;
    }

    markAsImportant() {
        this._isImportant = true;
    }

    markAsRead() {
        this._isRead = true;
    }

    markAsUnImportant() {
        this._isImportant = false;
    }

    markAsUnread() {
        this._isRead = false;
    }

    formatTime() {
        if (moment().diff(moment(this._timeSent.getTime()), 'days') > 0) {
            return moment(this._timeSent.getTime()).format('MMM D, h:mm a')
        } else {
            return moment(this._timeSent.getTime()).format('hh:mm a')
        }
    }
}