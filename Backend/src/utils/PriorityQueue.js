class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this.heap = [];
    this.comparator = comparator;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  enqueue(value) {
    this.heap.push(value);
    this.bubbleUp(this.size() - 1);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    if (this.size() === 1) return this.heap.pop();
    
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown(0);
    return top;
  }

  bubbleUp(index) {
    while (index > 0) {
      let parentIdx = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIdx])) {
        // Swap
        let temp = this.heap[index];
        this.heap[index] = this.heap[parentIdx];
        this.heap[parentIdx] = temp;
        index = parentIdx;
      } else {
        break;
      }
    }
  }

  sinkDown(index) {
    let lastIdx = this.size() - 1;
    while (true) {
      let leftIdx = 2 * index + 1;
      let rightIdx = 2 * index + 2;
      let swapIdx = null;

      if (leftIdx <= lastIdx) {
        if (this.comparator(this.heap[leftIdx], this.heap[index])) {
          swapIdx = leftIdx;
        }
      }

      if (rightIdx <= lastIdx) {
        if (
          (swapIdx === null && this.comparator(this.heap[rightIdx], this.heap[index])) ||
          (swapIdx !== null && this.comparator(this.heap[rightIdx], this.heap[leftIdx]))
        ) {
          swapIdx = rightIdx;
        }
      }

      if (swapIdx === null) break;

      // Swap
      let temp = this.heap[index];
      this.heap[index] = this.heap[swapIdx];
      this.heap[swapIdx] = temp;
      index = swapIdx;
    }
  }
}

module.exports = PriorityQueue;
