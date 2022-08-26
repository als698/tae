import { Component } from '@angular/core';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tae: { 1: boolean | string };
  taps = 1;
  title: string;
  winner: string | boolean;

  wins = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [3, 5, 7],
  ];

  constructor(private screenOrientation: ScreenOrientation) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.reset();
  }

  getTAE() {
    return {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
    };
  }

  reset() {
    this.tae = this.getTAE();
    this.winner = false;
    this.taps = 0;
    this.title = 'Tic Tac Toe';
  }

  tap(place: number) {
    const tap = 1; //this.taps + 1 % 2 === 1 ? 1 : 2; // user version

    const tae = this.setTAE(place, tap);

    if (tae && !this.winner) {
      setTimeout(() => {
        this.bot();
      }, 200);
    }
  }

  setTAE(place: number, action: number) {
    if (!this.tae[place] && !this.winner) {
      this.tae[place] = action === 1 ? 'x' : 'o';
      this.taps++;

      this.checkWin();
      return true;
    }

    return false;
  }

  bot(): void {
    if (this.taps === 1) {
      const places = [5, 1, 3, 7, 9];
      for (const place of places) {
        if (!this.tae[place]) {
          this.setTAE(place, 2);
          break;
        }
      }
    } else {
      this.setTAE(this.tryWin(), 2);
    }
  }

  tryWin(): number {
    let o = [];
    for (const win of this.wins) {
      o = [];
      for (const place of win) {
        if (this.tae[place] === 'o') {
          o.push(place);
        }
      }

      const oValue = win.filter((pos) => !o.includes(pos))[0];

      if (o.length === 2 && !this.tae[oValue]) {
        return oValue;
      }
    }

    return this.blockPlayer();
  }

  blockPlayer(): number {
    let x = [];
    for (const win of this.wins) {
      x = [];
      for (const place of win) {
        if (this.tae[place] === 'x') {
          x.push(place);
        }
      }

      const xValue = win.filter((pos) => !x.includes(pos))[0];

      if (x.length === 2 && !this.tae[xValue]) {
        return xValue;
      }
    }

    return this.findRowBot();
  }

  findRowBot(): number {
    let o = [];
    let f = [];
    for (const win of this.wins) {
      o = [];
      f = [];
      for (const place of win) {
        if (this.tae[place] === 'o') {
          o.push(place);
        } else if (this.tae[place] === false) {
          f.push(place);
        }
      }

      if (this.tae[5] === 'x') {
        const places = [1, 3, 7, 9];
        for (const place of places) {
          if (!this.tae[place]) {
            return place;
          }
        }
      }

      const oValues = win.filter((pos) => !o.includes(pos));
      if (o.length === 1 && !this.tae[oValues[0]] && !this.tae[oValues[1]]) {
        return oValues[0];
      }

      if (o.length === 1) {
        const places = [2, 4, 6];
        for (const place of places) {
          const newplace = place + (place === 4 ? 4 : 2);
          const pos = place + newplace - 5;
          if (
            this.tae[place] === 'x' &&
            this.tae[newplace] === 'x' &&
            !this.tae[pos]
          ) {
            return pos;
          }
        }
      }

      if (o.length && f.length) {
        if (f.length > 1) {
          return f[1];
        }
        return f[0];
      }
    }
  }

  checkWin(): boolean {
    for (const win of this.wins) {
      if (
        this.tae[win[0]] &&
        this.tae[win[0]] === this.tae[win[1]] &&
        this.tae[win[1]] === this.tae[win[2]]
      ) {
        this.winner = this.tae[win[0]] === 'x' ? 'X' : 'O';
        // this.title = this.winner + ' is winner';
        if (this.winner === 'X') {
          this.title = 'You win!';
        } else {
          this.title = 'You lose..';
        }

        return true;
      } else if (this.taps === 9) {
        this.winner = 'D';
        this.title = 'Draw';
        return true;
      }
    }

    return false;
  }
}
