import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'range' })
export class RangePipe implements PipeTransform {
  public transform(n: number): number[] {
    return Array.from({ length: n + 1}, (_, i) => i);
  }
}