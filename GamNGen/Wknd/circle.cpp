#include <iostream>
#include <vector>
#include <cmath>
#include <iomanip>

int main() {
    int radius;
    std::cout << "Enter the radius of the circle: ";
    std::cin >> radius;

    if (radius <= 0) {
        std::cerr << "Radius must be positive." << std::endl;
        return 1;
    }

    int diameter = 2 * radius;
    std::vector<std::vector<char>> grid(diameter + 1, std::vector<char>(diameter + 1, ' '));

    int x0 = radius;
    int y0 = radius;

    int x = radius;
    int y = 0;
    int err = 0;

    while (x >= y) {
        grid[y0 + y][x0 + x] = '*';
        grid[y0 + x][x0 + y] = '*';
        grid[y0 + x][x0 - y] = '*';
        grid[y0 + y][x0 - x] = '*';
        grid[y0 - y][x0 - x] = '*';
        grid[y0 - x][x0 - y] = '*';
        grid[y0 - x][x0 + y] = '*';
        grid[y0 - y][x0 + x] = '*';

        if (err <= 0) {
            y += 1;
            err += 2 * y + 1;
        }
        if (err > 0) {
            x -= 1;
            err -= 2 * x + 1;
        }
    }

    for (int i = 0; i <= diameter; ++i) {
        for (int j = 0; j <= diameter; ++j) {
            std::cout << grid[i][j] << ' ';
        }
        std::cout << std::endl;
    }

    return 0;
}