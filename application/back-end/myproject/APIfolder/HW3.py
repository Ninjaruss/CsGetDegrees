import random


# Returns expected fortune after # of gambles
def play_bet(gambles, prob, current_balance):
    # Check if out of money
    if current_balance <= 0:
        return 0

    # Return value of bet rounded to nearest int
    bet = int(round((2*prob - 1) * current_balance))
    # Flip biased coin, random() returns a num between [0,1)
    play_result = bool(random.random() < prob)

    # game_result = True -> Won bet; game_result = False -> Lost bet
    if play_result:
        current_balance += bet
    else:
        current_balance -= bet

    # Check if resulting balance after bet is less than 0
    if current_balance <= 0:
        return 0

    # Repeat gamble if not finished
    if gambles != 0:
        play_bet(gambles-1, prob, current_balance)

    return current_balance


# Number of simulations
simulations = 10000
# Number of gambles per game
n = 100
# Initial balance
x = 10
# Probability table
p_table = [0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95]


def main():
    # Make a fortune table for each simulation and add it to the table list
    simulated_fortune_tables = []
    for sim in range(simulations):
        new_fortune_table = []
        for p in p_table:
            new_fortune = play_bet(n, p, x)
            new_fortune_table.append(new_fortune)
        simulated_fortune_tables.append(new_fortune_table)

    # Initialize a table of zeros of same length as probability table
    sum_fortune_table = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    # Sum up each balance within each simulated fortune table
    for table in simulated_fortune_tables:
        index = 0
        for balance in table:
            sum_fortune_table[index] = sum_fortune_table[index] + balance
            index += 1
    print("Sum fortune table after", simulations, "simulations:")
    print(sum_fortune_table)
    print()

    # Divide sum fortune by the # of simulations to get average
    average_fortune_table = []
    for sum_fortune in sum_fortune_table:
        average_fortune_table.append(int(round(sum_fortune/simulations)))
    print("Expected fortune table:")
    print(average_fortune_table)


# Run program
if __name__ == "__main__":
    main()
