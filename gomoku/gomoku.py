#!/usr/bin/env python3
"""
五子棋游戏 (Gomoku)
一个基于控制台的双人对战五子棋游戏
"""

class Gomoku:
    """五子棋游戏类"""

    def __init__(self, size=15):
        """初始化棋盘"""
        self.size = size
        self.board = [['.' for _ in range(size)] for _ in range(size)]
        self.current_player = 'X'  # X 先手 (黑棋), O 后手 (白棋)
        self.game_over = False
        self.winner = None

    def display(self):
        """显示棋盘"""
        print("   ", end="")
        for i in range(self.size):
            print(f"{i:2} ", end="")
        print()

        for i in range(self.size):
            print(f"{i:2} ", end="")
            for j in range(self.size):
                print(f" {self.board[i][j]} ", end="")
            print()

    def is_valid_move(self, row, col):
        """检查落子是否有效"""
        if row < 0 or row >= self.size or col < 0 or col >= self.size:
            return False
        return self.board[row][col] == '.'

    def place_stone(self, row, col):
        """落子"""
        if self.is_valid_move(row, col):
            self.board[row][col] = self.current_player
            return True
        return False

    def check_win(self, row, col):
        """检查是否获胜"""
        player = self.board[row][col]
        directions = [
            (0, 1),   # 水平
            (1, 0),   # 垂直
            (1, 1),   # 右下斜线
            (1, -1)   # 左下斜线
        ]

        for dr, dc in directions:
            count = 1
            # 正方向
            r, c = row + dr, col + dc
            while 0 <= r < self.size and 0 <= c < self.size and self.board[r][c] == player:
                count += 1
                r += dr
                c += dc
            # 反方向
            r, c = row - dr, col - dc
            while 0 <= r < self.size and 0 <= c < self.size and self.board[r][c] == player:
                count += 1
                r -= dr
                c -= dc

            if count >= 5:
                return True
        return False

    def switch_player(self):
        """切换玩家"""
        self.current_player = 'O' if self.current_player == 'X' else 'X'

    def is_draw(self):
        """检查是否平局"""
        for row in self.board:
            for cell in row:
                if cell == '.':
                    return False
        return True

    def parse_input(self, input_str):
        """解析用户输入"""
        parts = input_str.strip().split()
        if len(parts) != 2:
            return None
        try:
            row = int(parts[0])
            col = int(parts[1])
            return (row, col)
        except ValueError:
            return None

    def play(self):
        """开始游戏"""
        print("=" * 50)
        print("欢迎来到五子棋游戏!")
        print("黑棋 (X) 先手，白棋 (O) 后手")
        print("输入格式：行号 列号 (例如：7 7 表示在天元落子)")
        print("输入 'q' 退出游戏")
        print("=" * 50)

        while not self.game_over:
            self.display()
            print(f"\n当前玩家：{'黑棋 (X)' if self.current_player == 'X' else '白棋 (O)'}")

            user_input = input("请输入落子位置：").strip()

            if user_input.lower() == 'q':
                print("游戏结束!")
                return

            move = self.parse_input(user_input)
            if move is None:
                print("无效输入！请使用格式：行号 列号 (例如：7 7)")
                continue

            row, col = move
            if not self.place_stone(row, col):
                print("无效落子！该位置已有棋子或超出棋盘范围")
                continue

            # 检查是否获胜
            if self.check_win(row, col):
                self.display()
                print(f"\n{'黑棋 (X)' if self.current_player == 'X' else '白棋 (O)'} 获胜!")
                self.game_over = True
                self.winner = self.current_player
            elif self.is_draw():
                self.display()
                print("\n平局!")
                self.game_over = True
            else:
                self.switch_player()

        print("游戏结束!")


def main():
    """主函数"""
    game = Gomoku()
    game.play()


if __name__ == "__main__":
    main()
