import { atom, DefaultValue } from "recoil";

const loadFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const LiveWeekState = atom({
  key: "liveweekstate",
  default: loadFromLocalStorage("liveweekstate"),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (!(newValue instanceof DefaultValue)) {
          saveToLocalStorage("liveweekstate", newValue);
        }
      });
    },
  ],
});


export const WeeksSums = atom({
  key: "weekssums",
  default: loadFromLocalStorage("weekssums"),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (!(newValue instanceof DefaultValue)) {
          saveToLocalStorage("weekssums", newValue);
        }
      });
    },
  ],
});
