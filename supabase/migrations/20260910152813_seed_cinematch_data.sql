/*
# CineMatch Seed Data

## Overview
Populates the genres table and inserts 36 realistic movie records spanning multiple genres, languages, release years, ratings, and moods. Also populates movie_genres junction table.

## Genres Added
Action, Comedy, Drama, Romance, Thriller, Horror, Sci-Fi, Fantasy, Animation, Adventure, Crime, Mystery

## Movies Added
36 movies across English, Telugu, Hindi, Tamil, Malayalam, Kannada, Korean, Japanese.

## Notes
- Uses ON CONFLICT DO NOTHING for idempotency.
- Posters use high-quality Pexels stock photography URLs.
- Each movie has cast and mood arrays for recommendation matching.
*/

-- ============ GENRES ============
INSERT INTO genres (name) VALUES
  ('Action'), ('Comedy'), ('Drama'), ('Romance'), ('Thriller'), ('Horror'),
  ('Sci-Fi'), ('Fantasy'), ('Animation'), ('Adventure'), ('Crime'), ('Mystery')
ON CONFLICT (name) DO NOTHING;

-- ============ MOVIES ============
-- We use a CTE to insert movies and capture their IDs for genre linking
WITH new_movies AS (
  INSERT INTO movies (title, description, poster_url, release_year, rating, language, duration, director, "cast", mood, created_at) VALUES
  -- English movies
  ('The Dark Knight', 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.', 'https://images.pexels.com/photos/7234253/pexels-photo-7234253.jpeg?auto=compress&cs=tinysrgb&w=600', 2008, 9.0, 'English', 152, 'Christopher Nolan', ARRAY['Christian Bale','Heath Ledger','Aaron Eckhart'], ARRAY['Thrilling','Excited','Motivated'], '2024-01-01T00:00:00Z'),
  ('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.', 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=600', 2010, 8.8, 'English', 148, 'Christopher Nolan', ARRAY['Leonardo DiCaprio','Joseph Gordon-Levitt','Elliot Page'], ARRAY['Thrilling','Excited','Emotional'], '2024-01-02T00:00:00Z'),
  ('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'https://images.pexels.com/photos/73910/mars-mars-red-planet-planet-73910.jpeg?auto=compress&cs=tinysrgb&w=600', 2014, 8.6, 'English', 169, 'Christopher Nolan', ARRAY['Matthew McConaughey','Anne Hathaway','Jessica Chastain'], ARRAY['Emotional','Motivated','Thrilling'], '2024-01-03T00:00:00Z'),
  ('Parasite', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=600', 2019, 8.5, 'Korean', 132, 'Bong Joon-ho', ARRAY['Song Kang-ho','Lee Sun-kyun','Cho Yeo-jeong'], ARRAY['Thrilling','Emotional','Excited'], '2024-01-04T00:00:00Z'),
  ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'https://images.pexels.com/photos/7231989/pexels-photo-7231989.jpeg?auto=compress&cs=tinysrgb&w=600', 1972, 9.2, 'English', 175, 'Francis Ford Coppola', ARRAY['Marlon Brando','Al Pacino','James Caan'], ARRAY['Emotional','Thrilling','Romantic'], '2024-01-05T00:00:00Z'),
  ('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 'https://images.pexels.com/photos/3317054/pexels-photo-3317054.jpeg?auto=compress&cs=tinysrgb&w=600', 1994, 8.9, 'English', 154, 'Quentin Tarantino', ARRAY['John Travolta','Uma Thurman','Samuel L. Jackson'], ARRAY['Thrilling','Excited','Happy'], '2024-01-06T00:00:00Z'),
  ('Forrest Gump', 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.', 'https://images.pexels.com/photos/2255444/pexels-photo-2255444.jpeg?auto=compress&cs=tinysrgb&w=600', 1994, 8.8, 'English', 142, 'Robert Zemeckis', ARRAY['Tom Hanks','Robin Wright','Gary Sinise'], ARRAY['Emotional','Happy','Romantic'], '2024-01-07T00:00:00Z'),
  ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=600', 1994, 9.3, 'English', 142, 'Frank Darabont', ARRAY['Tim Robbins','Morgan Freeman','Bob Gunton'], ARRAY['Emotional','Motivated','Romantic'], '2024-01-08T00:00:00Z'),
  ('The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600', 1999, 8.7, 'English', 136, 'The Wachowskis', ARRAY['Keanu Reeves','Laurence Fishburne','Carrie-Anne Moss'], ARRAY['Thrilling','Excited','Motivated'], '2024-01-09T00:00:00Z'),
  ('Gladiator', 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.', 'https://images.pexels.com/photos/532001/pexels-photo-532001.jpeg?auto=compress&cs=tinysrgb&w=600', 2000, 8.5, 'English', 155, 'Ridley Scott', ARRAY['Russell Crowe','Joaquin Phoenix','Connie Nielsen'], ARRAY['Thrilling','Emotional','Motivated'], '2024-01-10T00:00:00Z'),
  ('La La Land', 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.', 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=600', 2016, 8.0, 'English', 128, 'Damien Chazelle', ARRAY['Ryan Gosling','Emma Stone','John Legend'], ARRAY['Romantic','Happy','Emotional'], '2024-01-11T00:00:00Z'),
  ('Whiplash', 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.', 'https://images.pexels.com/photos/4709822/pexels-photo-4709822.jpeg?auto=compress&cs=tinysrgb&w=600', 2014, 8.5, 'English', 106, 'Damien Chazelle', ARRAY['Miles Teller','J.K. Simmons','Melissa Benoist'], ARRAY['Thrilling','Motivated','Excited'], '2024-01-12T00:00:00Z'),
  ('Get Out', 'A young African-American visits his white girlfriend''s parents for the weekend, where his simmering uneasiness eventually reaches a boiling point.', 'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=600', 2017, 7.7, 'English', 104, 'Jordan Peele', ARRAY['Daniel Kaluuya','Allison Williams','Bradley Whitford'], ARRAY['Scared','Thrilling','Excited'], '2024-01-13T00:00:00Z'),
  ('Hereditary', 'A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.', 'https://images.pexels.com/photos/7233255/pexels-photo-7233255.jpeg?auto=compress&cs=tinysrgb&w=600', 2018, 7.3, 'English', 127, 'Ari Aster', ARRAY['Toni Collette','Alex Wolff','Milly Shapiro'], ARRAY['Scared','Thrilling','Emotional'], '2024-01-14T00:00:00Z'),
  ('Spirited Away', 'During her family''s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.', 'https://images.pexels.com/photos/3224196/pexels-photo-3224196.jpeg?auto=compress&cs=tinysrgb&w=600', 2001, 8.6, 'Japanese', 125, 'Hayao Miyazaki', ARRAY['Rumi Hiiragi','Miyu Irino','Mari Natsuki'], ARRAY['Happy','Emotional','Relaxed'], '2024-01-15T00:00:00Z'),
  ('Your Name', 'Two strangers find themselves linked in a bizarre way: they exchange bodies for a day and must work together to uncover the mystery.', 'https://images.pexels.com/photos/3735186/pexels-photo-3735186.jpeg?auto=compress&cs=tinysrgb&w=600', 2016, 8.4, 'Japanese', 106, 'Makoto Shinkai', ARRAY['Ryunosuke Kamiki','Mone Kamishiraishi','Masami Nagasawa'], ARRAY['Romantic','Emotional','Happy'], '2024-01-16T00:00:00Z'),
  ('Train to Busan', 'While a zombie virus breaks out in South Korea, passengers struggle to survive on the train from Seoul to Busan.', 'https://images.pexels.com/photos/2255441/pexels-photo-2255441.jpeg?auto=compress&cs=tinysrgb&w=600', 2016, 7.6, 'Korean', 118, 'Yeon Sang-ho', ARRAY['Gong Yoo','Jung Yu-mi','Ma Dong-seok'], ARRAY['Thrilling','Scared','Excited'], '2024-01-17T00:00:00Z'),
  ('Oldboy', 'A man seeking vengeance after being imprisoned for 15 years without knowing why must uncover the truth behind his captor''s identity.', 'https://images.pexels.com/photos/3756829/pexels-photo-3756829.jpeg?auto=compress&cs=tinysrgb&w=600', 2003, 8.4, 'Korean', 120, 'Park Chan-wook', ARRAY['Choi Min-sik','Yoo Ji-tae','Kang Hye-jung'], ARRAY['Thrilling','Emotional','Excited'], '2024-01-18T00:00:00Z'),
  -- Hindi movies
  ('3 Idiots', 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.', 'https://images.pexels.com/photos/3747591/pexels-photo-3747591.jpeg?auto=compress&cs=tinysrgb&w=600', 2009, 8.4, 'Hindi', 170, 'Rajkumar Hirani', ARRAY['Aamir Khan','R. Madhavan','Sharman Joshi'], ARRAY['Happy','Motivated','Emotional'], '2024-01-19T00:00:00Z'),
  ('Dangal', 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.', 'https://images.pexels.com/photos/704554/pexels-photo-704554.jpeg?auto=compress&cs=tinysrgb&w=600', 2016, 8.3, 'Hindi', 161, 'Nitesh Tiwari', ARRAY['Aamir Khan','Fatima Sana Shaikh','Sanya Malhotra'], ARRAY['Motivated','Emotional','Happy'], '2024-01-20T00:00:00Z'),
  ('Andhadhun', 'A series of mysterious events change the life of a blind pianist, who must now report a crime that was actually never witnessed by him.', 'https://images.pexels.com/photos/3756835/pexels-photo-3756835.jpeg?auto=compress&cs=tinysrgb&w=600', 2018, 8.2, 'Hindi', 139, 'Sriram Raghavan', ARRAY['Ayushmann Khurrana','Tabu','Radhika Apte'], ARRAY['Thrilling','Excited','Scared'], '2024-01-21T00:00:00Z'),
  ('Zindagi Na Milegi Dobara', 'Three friends decide to turn their fantasy vacation into a road trip and embark on a life-changing journey to Spain.', 'https://images.pexels.com/photos/2255444/pexels-photo-2255444.jpeg?auto=compress&cs=tinysrgb&w=600', 2011, 8.1, 'Hindi', 155, 'Zoya Akhtar', ARRAY['Hrithik Roshan','Farhan Akhtar','Abhay Deol'], ARRAY['Happy','Relaxed','Romantic'], '2024-01-22T00:00:00Z'),
  ('Drishyam', 'A man tries to save his family from the dark side of the law after they commit an unexpected crime.', 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=600', 2015, 8.2, 'Hindi', 163, 'Nishikant Kamat', ARRAY['Ajay Devgn','Tabu','Shriya Saran'], ARRAY['Thrilling','Excited','Emotional'], '2024-01-23T00:00:00Z'),
  -- Telugu movies
  ('Baahubali: The Beginning', 'A young man discovers he is the heir to a powerful kingdom and must reclaim his throne from an evil tyrant.', 'https://images.pexels.com/photos/2255441/pexels-photo-2255441.jpeg?auto=compress&cs=tinysrgb&w=600', 2015, 8.0, 'Telugu', 159, 'S.S. Rajamouli', ARRAY['Prabhas','Rana Daggubati','Anushka Shetty'], ARRAY['Excited','Thrilling','Motivated'], '2024-01-24T00:00:00Z'),
  ('RRR', 'A fictitious story about two legendary revolutionaries and their journey away from home before they began fighting for their country.', 'https://images.pexels.com/photos/532001/pexels-photo-532001.jpeg?auto=compress&cs=tinysrgb&w=600', 2022, 7.8, 'Telugu', 187, 'S.S. Rajamouli', ARRAY['N.T. Rama Rao Jr.','Ram Charan','Ajay Devgn'], ARRAY['Excited','Thrilling','Motivated'], '2024-01-25T00:00:00Z'),
  ('Evaraina Epudaina', 'A young man falls in love at first sight and goes to great lengths to win her heart, discovering the true meaning of love.', 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=600', 2009, 7.2, 'Telugu', 145, 'Marthand K. Shankar', ARRAY['Varun Sandesh','Vimala Raman','Giri Babu'], ARRAY['Romantic','Happy','Relaxed'], '2024-01-26T00:00:00Z'),
  ('Arjun Reddy', 'A brilliant medical student with anger management issues spirals into self-destruction after a painful breakup.', 'https://images.pexels.com/photos/3756829/pexels-photo-3756829.jpeg?auto=compress&cs=tinysrgb&w=600', 2017, 7.6, 'Telugu', 182, 'Sandeep Reddy Vanga', ARRAY['Vijay Deverakonda','Shalini Pandey','Jia Sharma'], ARRAY['Emotional','Romantic','Thrilling'], '2024-01-27T00:00:00Z'),
  -- Tamil movies
  ('Vikram', 'A high-octane action film where a special investigator uncovers a series of murders linked to a powerful drug syndicate.', 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600', 2022, 8.0, 'Tamil', 173, 'Lokesh Kanagaraj', ARRAY['Kamal Haasan','Vijay Sethupathi','Fahadh Faasil'], ARRAY['Thrilling','Excited','Motivated'], '2024-01-28T00:00:00Z'),
  ('Kaithi', 'A recently released prisoner races against time to save a group of police officers from a gang of drug dealers.', 'https://images.pexels.com/photos/7234253/pexels-photo-7234253.jpeg?auto=compress&cs=tinysrgb&w=600', 2019, 8.1, 'Tamil', 145, 'Lokesh Kanagaraj', ARRAY['Karthi','Narain','Dheena'], ARRAY['Thrilling','Excited','Motivated'], '2024-01-29T00:00:00Z'),
  ('Super Deluxe', 'Multiple storylines intertwine in unexpected ways, exploring themes of identity, morality, and human connection.', 'https://images.pexels.com/photos/3317054/pexels-photo-3317054.jpeg?auto=compress&cs=tinysrgb&w=600', 2019, 8.0, 'Tamil', 176, 'Thiagarajan Kumararaja', ARRAY['Vijay Sethupathi','Fahadh Faasil','Samantha Ruth Prabhu'], ARRAY['Thrilling','Emotional','Excited'], '2024-01-30T00:00:00Z'),
  ('96', 'Two high school sweethearts meet after 22 years and spend a day reminiscing about their past and unspoken feelings.', 'https://images.pexels.com/photos/3735186/pexels-photo-3735186.jpeg?auto=compress&cs=tinysrgb&w=600', 2018, 8.3, 'Tamil', 138, 'C. Prem Kumar', ARRAY['Vijay Sethupathi','Trisha Krishnan','Devadarshini'], ARRAY['Romantic','Emotional','Happy'], '2024-01-31T00:00:00Z'),
  -- Malayalam movies
  ('Premam', 'A young man navigates through three stages of love, each shaping his understanding of romance and life.', 'https://images.pexels.com/photos/2255444/pexels-photo-2255444.jpeg?auto=compress&cs=tinysrgb&w=600', 2015, 8.0, 'Malayalam', 137, 'Alphonse Puthren', ARRAY['Nivin Pauly','Sai Pallavi','Madonna Sebastian'], ARRAY['Romantic','Happy','Emotional'], '2024-02-01T00:00:00Z'),
  ('Drishyam (Malayalam)', 'A man will go to any lengths to protect his family from the dark side of the law after they commit an unexpected crime.', 'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=600', 2013, 8.5, 'Malayalam', 160, 'Jeethu Joseph', ARRAY['Mohanlal','Meena','Ansiba Hassan'], ARRAY['Thrilling','Excited','Emotional'], '2024-02-02T00:00:00Z'),
  ('Kumbalangi Nights', 'Four brothers living together in a small village navigate their troubled relationships and find their way to each other.', 'https://images.pexels.com/photos/3747591/pexels-photo-3747591.jpeg?auto=compress&cs=tinysrgb&w=600', 2019, 8.5, 'Malayalam', 135, 'Madhu C. Narayanan', ARRAY['Soubin Shahir','Shane Nigam','Fahadh Faasil'], ARRAY['Emotional','Happy','Relaxed'], '2024-02-03T00:00:00Z'),
  -- Kannada movies
  ('KGF: Chapter 1', 'In the 1970s, a fierce rebel rises against brutal oppression and becomes the symbol of hope for the downtrodden.', 'https://images.pexels.com/photos/7231989/pexels-photo-7231989.jpeg?auto=compress&cs=tinysrgb&w=600', 2018, 8.2, 'Kannada', 156, 'Prashanth Neel', ARRAY['Yash','Srinidhi Shetty','Ramachandra Raju'], ARRAY['Excited','Thrilling','Motivated'], '2024-02-04T00:00:00Z'),
  ('Lucia', 'A man suffering from insomnia finds solace in a mysterious pill that blurs the lines between dreams and reality.', 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=600', 2013, 8.0, 'Kannada', 135, 'Pawan Kumar', ARRAY['Sathish Ninasam','Sruthi Hariharan','Achyuth Kumar'], ARRAY['Thrilling','Emotional','Scared'], '2024-02-05T00:00:00Z'),
  ('Ugramm', 'A man with a violent past returns to his hometown to protect his family from a dangerous gangster.', 'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=600', 2014, 7.8, 'Kannada', 130, 'Prashanth Neel', ARRAY['Srimurali','Haripriya','Thilak Shekar'], ARRAY['Thrilling','Excited','Motivated'], '2024-02-06T00:00:00Z')
  RETURNING id, title
)
-- ============ MOVIE_GENRES ============
INSERT INTO movie_genres (movie_id, genre_id)
SELECT nm.id, g.id FROM new_movies nm
JOIN genres g ON
  (nm.title = 'The Dark Knight' AND g.name IN ('Action','Crime','Drama','Thriller')) OR
  (nm.title = 'Inception' AND g.name IN ('Action','Sci-Fi','Thriller','Mystery')) OR
  (nm.title = 'Interstellar' AND g.name IN ('Adventure','Drama','Sci-Fi')) OR
  (nm.title = 'Parasite' AND g.name IN ('Drama','Thriller','Mystery','Comedy')) OR
  (nm.title = 'The Godfather' AND g.name IN ('Crime','Drama')) OR
  (nm.title = 'Pulp Fiction' AND g.name IN ('Crime','Drama','Thriller')) OR
  (nm.title = 'Forrest Gump' AND g.name IN ('Drama','Romance','Comedy')) OR
  (nm.title = 'The Shawshank Redemption' AND g.name IN ('Crime','Drama')) OR
  (nm.title = 'The Matrix' AND g.name IN ('Action','Sci-Fi','Thriller')) OR
  (nm.title = 'Gladiator' AND g.name IN ('Action','Adventure','Drama')) OR
  (nm.title = 'La La Land' AND g.name IN ('Comedy','Drama','Romance')) OR
  (nm.title = 'Whiplash' AND g.name IN ('Drama','Thriller')) OR
  (nm.title = 'Get Out' AND g.name IN ('Horror','Mystery','Thriller')) OR
  (nm.title = 'Hereditary' AND g.name IN ('Horror','Mystery','Thriller')) OR
  (nm.title = 'Spirited Away' AND g.name IN ('Animation','Adventure','Fantasy')) OR
  (nm.title = 'Your Name' AND g.name IN ('Animation','Drama','Romance','Fantasy')) OR
  (nm.title = 'Train to Busan' AND g.name IN ('Action','Horror','Thriller')) OR
  (nm.title = 'Oldboy' AND g.name IN ('Action','Mystery','Thriller','Crime')) OR
  (nm.title = '3 Idiots' AND g.name IN ('Comedy','Drama','Romance')) OR
  (nm.title = 'Dangal' AND g.name IN ('Action','Drama','Sport')) OR
  (nm.title = 'Andhadhun' AND g.name IN ('Crime','Mystery','Thriller','Drama')) OR
  (nm.title = 'Zindagi Na Milegi Dobara' AND g.name IN ('Comedy','Drama','Romance','Adventure')) OR
  (nm.title = 'Drishyam' AND g.name IN ('Crime','Drama','Mystery','Thriller')) OR
  (nm.title = 'Baahubali: The Beginning' AND g.name IN ('Action','Adventure','Drama','Fantasy')) OR
  (nm.title = 'RRR' AND g.name IN ('Action','Drama','Adventure')) OR
  (nm.title = 'Evaraina Epudaina' AND g.name IN ('Romance','Drama','Comedy')) OR
  (nm.title = 'Arjun Reddy' AND g.name IN ('Drama','Romance','Action')) OR
  (nm.title = 'Vikram' AND g.name IN ('Action','Crime','Thriller')) OR
  (nm.title = 'Kaithi' AND g.name IN ('Action','Crime','Thriller')) OR
  (nm.title = 'Super Deluxe' AND g.name IN ('Drama','Crime','Mystery','Thriller')) OR
  (nm.title = '96' AND g.name IN ('Romance','Drama')) OR
  (nm.title = 'Premam' AND g.name IN ('Romance','Drama','Comedy')) OR
  (nm.title = 'Drishyam (Malayalam)' AND g.name IN ('Crime','Drama','Mystery','Thriller')) OR
  (nm.title = 'Kumbalangi Nights' AND g.name IN ('Drama','Comedy')) OR
  (nm.title = 'KGF: Chapter 1' AND g.name IN ('Action','Crime','Drama','Thriller')) OR
  (nm.title = 'Lucia' AND g.name IN ('Mystery','Thriller','Drama')) OR
  (nm.title = 'Ugramm' AND g.name IN ('Action','Crime','Drama','Thriller'))
ON CONFLICT (movie_id, genre_id) DO NOTHING;
