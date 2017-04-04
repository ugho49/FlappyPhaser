export class ScoreService {

    constructor(private game: string) { }

    getHightscore(): number {
        let hightscore = localStorage.getItem(this.game);
        return hightscore != null ? parseInt(hightscore) : 0;
    }

    setHightscore(score: number): void {
        let currentScore = this.getHightscore();

        if (score > currentScore) {
            localStorage.setItem(this.game, score.toString());
        }
    }
}