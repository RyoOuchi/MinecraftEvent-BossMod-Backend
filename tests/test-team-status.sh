#!/bin/bash

BASE_URL="http://localhost:3000"

echo "========== RESET DATABASE =========="
curl -X DELETE "$BASE_URL/debug/reset-db"
echo -e "\n"

echo "========== SPAWN BOSS 1 =========="
curl -X POST "$BASE_URL/minecraft/spawned-boss" \
  -H "Content-Type: application/json" \
  -d '{"teamID":"A","bossID":1}'
echo -e "\n"

sleep 2

echo "========== SPAWN BOSS 2 =========="
curl -X POST "$BASE_URL/minecraft/spawned-boss" \
  -H "Content-Type: application/json" \
  -d '{"teamID":"A","bossID":2}'
echo -e "\n"

sleep 3

echo "========== DEFEAT BOSS 1 =========="
curl -X POST "$BASE_URL/minecraft/defeated-boss" \
  -H "Content-Type: application/json" \
  -d '{"teamID":"A","bossID":1}'
echo -e "\n"

sleep 1

echo "========== CURRENTLY FIGHTING =========="
curl "$BASE_URL/display/team-status/currently-fighting-boss?teamID=A"
echo -e "\n"

echo "========== DEFEATED BOSS TIME =========="
curl "$BASE_URL/display/team-status/defeated-boss?teamID=A"
echo -e "\n"

echo "========== DONE =========="