#!/usr/local/bin/perl

use strict;

use Getopt::Long;
use File::Basename;

$\ = "\n";
my $output_file = dirname(__FILE__) . "/../mojits/Game/assets/play.css";
my $container_selector = "#game-play-board";
my $child_selector = "#game-play-board .board-square";
my $board_length = 9;
my $width_of_square = 7;
my $height_of_square = 7;

open(FH, ">$output_file") or die("Could not open $output_file");

my $i;
my $left;
my $top;
my $container_width = ($width_of_square * $board_length). "em";
my $container_height = ($width_of_square * $board_length). "em";

print FH "$container_selector {position: relative;width: $container_width; height: $container_height;}";
print FH "$child_selector {position: absolute;height:${height_of_square}em;width:${width_of_square}em;}";
for ($i = 1; $i <= $board_length; $i++) {
    $left = $width_of_square * ($i - 1);
    print FH "$container_selector :nth-child($i) {left: ${left}em;}";
}
my $j;
$left = $width_of_square * ($board_length - 1);
for ($j = 1;$j < $board_length;$i++, $j++) {
    $top = $height_of_square*$j;
    print FH "$container_selector :nth-child($i) {top: ${top}em; left: ${left}em;}";
}
$top = $height_of_square * ($board_length - 1);
for ($j = $board_length - 2;$j >= 0;$i++, $j--) {
    $left = $width_of_square*$j;
    print FH "$container_selector :nth-child($i) {top: ${top}em; left: ${left}em;}";
}
for ($j = $board_length - 2;$j > 0;$i++, $j--) {
    $top = $height_of_square*$j;
    print FH "$container_selector :nth-child($i) {top: ${top}em;}";
}

