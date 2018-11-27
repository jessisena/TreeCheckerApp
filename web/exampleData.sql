INSERT INTO auth_group(name) VALUES('admin'),('user');
INSERT INTO api_country(code, name) VALUES('cat', 'Catalunya'),('es', 'España'),('uk', 'United Kingdom');
UPDATE api_user SET occupation='Developer', country_id=1, language='ca' WHERE id=1;
UPDATE api_user SET occupation='Analista', country_id=2, language='es' WHERE id=2;
INSERT INTO api_user_groups(user_id, group_id) VALUES(1,2),(2,1);
INSERT INTO api_geographicalzone(name, country_id, layer_name, wms_url, proj, image_url, x_min, x_max, y_min, y_max) VALUES
('Berga', 1, 'ciutats', 'wmsURL', 'proj1', 'gz/1.png','1.81519', '1.862311', '42.088096', '42.108507'),
('Berguedà', 1, 'comarques', 'wmsURL', 'proj2', 'gz/2.png', '1.608124', '2.072292', '41.899211', '42.327078'),
('Barcelona', 1, 'provincies', 'wmsURL', 'proj3', 'gz/3.png', '1.608124', '2.400513', '41.19519', '42.293564'),
('Catalunya', 1, 'ccaa', 'wmsURL', 'proj4', 'gz/4.png', '0.153809', '3.345377', '40.442767', '42.87999'),
('Espanya', 1, 'paisos', 'wmsURL', 'proj5', 'gz/5.png', '-9.711914', '3.581543', '36.013561', '43.644026'),
('Europa', 1, 'món', 'wmsURL', 'proj6', 'gz/6.png', '-25.664062', '40.869141', '35.317366', '71.300793'),
('Terra', 1, 'planetes', 'wmsURL', 'proj7', 'gz/7.png', '0.0', '180.0', '0.0', '90.0');
INSERT INTO api_ggz(group_id, geographical_zone_id) VALUES(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(2,1),(2,2);
INSERT INTO api_aoi(name, x_min, x_max, y_min, y_max, geographical_zone_id, creation_date, is_deleted, user_id) 
VALUES('El vall', 1.847184, 1.856271, 42.103886, 42.104607, 1, NOW(), false, 1),
('Casserres', 1.829846, 1.852055, 42.004503, 42.015616, 2, NOW(), false, 2), 
('Passeig de la pau', 1.844118, 1.846347, 42.097506, 42.101407, 1, NOW(), false, 1);
INSERT INTO api_treespecie(name) VALUES('specie1'), ('specie2'), ('specie3');
INSERT INTO api_crowndiameter(name) VALUES('0.1'),('0.35'),('0.60'),('0.85'),
('1.1'),('1.35'),('1.60'),('1.85'),
('2.1'),('2.35'),('2.60'),('2.85'),
('3.1'),('3.35'),('3.60'),('3.85'),
('4.1'),('4.35'),('4.60'),('4.85'),
('5.1'),('5.35'),('5.60'),('5.85'),
('6.1'),('6.35'),('6.60'),('6.85'),
('7.1'),('7.35'),('7.60'),('7.85'),
('8.1'),('8.35'),('8.60'),('8.85'),
('9.1'),('9.35'),('9.60'),('9.85'),
('10.1'),('10.35'),('10.60'),('10.85'),
('11.1'),('11.35'),('11.60'),('11.85'),
('12.1'),('12.35'),('12.60'),('12.85'),
('13.1'),('13.35'),('13.60'),('13.85'),
('14.1'),('14.35'),('14.60'),('14.85'),
('15.1'),('15.35'),('15.60'),('15.85'),
('16.1'),('16.35'),('16.60'),('16.85'),
('17.1'),('17.35'),('17.60'),('17.85'),
('18.1'),('18.35'),('18.60'),('18.85'),
('19.1'),('19.35'),('19.60'),('19.85'),
('20.1'),('20.35'),('20.60'),('20.85'),
('21.1'),('21.35'),('21.60'),('21.85'),
('22.1'),('22.35'),('22.60'),('22.85'),
('23.1'),('23.35'),('23.60'),('23.85'),
('24.1'),('24.35'),('24.60'),('24.85'),
('25.1'),('25.35'),('25.60'),('25.85'),
('26.1'),('26.35'),('26.60'),('26.85'),
('27.1'),('27.35'),('27.60'),('27.85'),
('28.1'),('28.35'),('28.60'),('28.85'),
('29.1'),('29.35'),('29.60'),('29.85'),
('30.1');
;
INSERT INTO api_canopystatus(name) VALUES('status1'),('status2'),('status3'),('status4'),('status5');
INSERT INTO api_surveydata(name, tree_specie_id, crown_diameter_id, canopy_status_id, comment, user_id, aoi_id, gz_id, longitude, latitude, compass, creation_date, update_date, is_deleted)
VALUES('Tree1', 1, 1, 2, 'Comentari 1', 1, 1, 1, 1.849544, 42.104026, 35.378, NOW(), NOW(), false),
('Tree2', 1, 7, 3, 'Comentari 2', 1, 2, 2, 1.83455, 42.005069, 57.123, NOW(), NOW(), false),
('Tree3', 2, 4, 1, 'Comentari 3', 2, 3, 2, 1.844567, 42.100029, 12.654, NOW(), NOW(), false),
('Tree4', 3, 11, 5, 'Comentari 4', 2, 3, 2, 1.83455, 42.005069, 15.654, NOW(), NOW(), false);
INSERT INTO api_photo(survey_data_id, longitude, latitude, compass, url) VALUES(4, 1.849544, 42.104026, 35.378, 'obs/1.png'),
(3, 1.849544, 42.104026, 35.378, 'obs/2.png'),
(1, 1.849544, 42.104026, 35.378, 'obs/3.png'),
(1, 1.849544, 42.104026, 25.378, 'obs/4.png'),
(4, 1.849544, 42.104026, 25.378, 'obs/5.png');