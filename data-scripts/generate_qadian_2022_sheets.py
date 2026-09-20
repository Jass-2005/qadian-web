# -*- coding: utf-8 -*-
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import pandas as pd

# Detailed booth data matching the exact handwriting of 2022 Form-20 PDF
# Format: (Booth_No, Exact_Handwritten_In_PDF, Resolved_Punjabi_Name, English_Name, AAP, SAD, INC, Baaki)
booth_data = [
    # Page 1 (Booths 1 - 14)
    (1, 'ਜੋਗੇਵਾਲ ਜੱਟਾਂ', 'ਜੋਗੇਵਾਲ ਜੱਟਾਂ', 'Jogewal Jattan', 188, 98, 236, 15),
    (2, 'ਛੋਟੇਪੁਰ', 'ਛੋਟੇਪੁਰ', 'Chhotepur', 311, 114, 172, 25),
    (3, 'ਆਲੋਵਾਲ', 'ਆਲੋਵਾਲ', 'Alowal', 165, 105, 176, 32),
    (4, '-DO-', 'ਆਲੋਵਾਲ', 'Alowal', 119, 122, 178, 39),
    (5, 'ਕੋਟ ਸੰਤੋਖ ਰਾਏ', 'ਕੋਟ ਸੰਤੋਖ ਰਾਏ', 'Kot Santokh Rai', 251, 166, 188, 20),
    (6, '-DO-', 'ਕੋਟ ਸੰਤੋਖ ਰਾਏ', 'Kot Santokh Rai', 219, 245, 150, 32),
    (7, 'ਥੇਹ ਤਿੱਖਾ', 'ਥੇਹ ਤਿੱਖਾ', 'Theh Tikha', 211, 235, 178, 48),
    (8, 'ਚੱਕ ਦੀਪੇਵਾਲ', 'ਚੱਕ ਦੀਪੇਵਾਲ', 'Chak Dipewal', 147, 125, 334, 14),
    (9, 'ਬੱਲ', 'ਬੱਲ', 'Bal', 195, 58, 300, 36),
    (10, '-DO-', 'ਬੱਲ', 'Bal', 229, 76, 329, 14),
    (11, 'ਸੰਘਰ', 'ਸੰਘਰ', 'Sanghar', 144, 95, 467, 24),
    (12, 'ਅਖਲਾਸਪੁਰ', 'ਅਖਲਾਸਪੁਰ', 'Akhlaspur', 152, 25, 226, 15),
    (13, 'ਸਿੰਘਪੁਰਾ', 'ਸਿੰਘਪੁਰਾ', 'Singhpura', 283, 129, 188, 31),
    (14, 'ਬਦੇਸ਼ਾਂ', 'ਬਦੇਸ਼ਾਂ', 'Badesh', 203, 127, 139, 22),

    # Page 2 (Booths 15 - 28)
    (15, 'ਸੰਧਵਾਂ', 'ਸੰਧਵਾਂ', 'Sandhwan', 238, 49, 126, 27),
    (16, 'ਕਲਿਆਣਪੁਰ', 'ਕਲਿਆਣਪੁਰ', 'Kalayanpur', 127, 164, 138, 169),
    (17, '-DO-', 'ਕਲਿਆਣਪੁਰ', 'Kalyanpur', 221, 229, 168, 119),
    (18, 'ਗੁਰਦਾਸ ਨੰਗਲ', 'ਗੁਰਦਾਸ ਨੰਗਲ', 'Gurdas Nangal', 161, 202, 269, 17),
    (19, '-DO-', 'ਗੁਰਦਾਸ ਨੰਗਲ', 'Gurdas Nangal', 288, 281, 214, 25),
    (20, '-DO-', 'ਗੁਰਦਾਸ ਨੰਗਲ', 'Gurdas Nangal', 326, 139, 120, 27),
    (21, 'ਜਾਪੂਵਾਲ', 'ਜਾਪੂਵਾਲ', 'Japuwal', 106, 85, 173, 17),
    (22, 'ਧਾਰੀਵਾਲ', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 99, 106, 122, 26),
    (23, 'ਸੋਹਲ', 'ਸੋਹਲ', 'Sohal', 399, 130, 272, 55),
    (24, '-DO-', 'ਸੋਹਲ', 'Sohal', 327, 223, 183, 39),
    (25, '-DO-', 'ਸੋਹਲ', 'Sohal', 239, 212, 229, 49),
    (26, '-DO-', 'ਸੋਹਲ', 'Sohal', 241, 232, 163, 41),
    (27, 'ਮਹਾਂਦੇਵ ਕਲਾਂ', 'ਮਹਾਂਦੇਵ ਕਲਾਂ', 'Mahadev Kalan', 146, 111, 91, 20),
    (28, 'ਪੀਰ ਦੀ ਸੈਨ', 'ਪੀਰ ਦੀ ਸੈਨ', 'Pir Di Sain', 194, 16, 148, 4),

    # Page 3 (Booths 29 - 42)
    (29, 'ਤਰੀਜਾ ਨਗਰ', 'ਤਰੀਜਾ ਨਗਰ', 'Trija Nagar', 283, 178, 293, 24),
    (30, 'ਰਣੀਆਂ', 'ਰਣੀਆਂ', 'Ranian', 224, 127, 196, 23),
    (31, 'ਰਣੀਆਂ', 'ਰਣੀਆਂ', 'Ranian', 170, 200, 146, 25),
    (32, 'ਰਣੀਆ', 'ਰਣੀਆ', 'Rania', 321, 193, 177, 34),
    (33, 'ਧਾਰੀਵਾਲ', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 300, 177, 244, 53),
    (34, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 328, 165, 210, 53),
    (35, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 253, 193, 157, 37),
    (36, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 142, 100, 147, 31),
    (37, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 247, 150, 162, 40),
    (38, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 228, 154, 244, 28),
    (39, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 64, 61, 63, 15),
    (40, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 127, 74, 120, 1),
    (41, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 139, 221, 159, 20),
    (42, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 213, 306, 240, 25),

    # Page 4 (Booths 43 - 56)
    (43, 'ਧਾਰੀਵਾਲ', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 216, 146, 180, 58),
    (44, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 164, 123, 110, 39),
    (45, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 283, 212, 220, 30),
    (46, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 130, 314, 73, 18),
    (47, '-DO-', 'ਧਾਰੀਵਾਲ', 'Dhariwal', 303, 172, 240, 28),
    (48, 'ਡੱਡਵਾਂ', 'ਡੱਡਵਾਂ', 'Dadwan', 215, 148, 414, 30),
    (49, '-DO-', 'ਡੱਡਵਾਂ', 'Dadwan', 147, 224, 367, 23),
    (50, 'ਕੰਗ', 'ਕੰਗ', 'Kang', 161, 128, 337, 30),
    (51, '-DO-', 'ਕੰਗ', 'Kang', 100, 138, 324, 24),
    (52, 'ਅਹਿਮਦਾਬਾਦ', 'ਅਹਿਮਦਾਬਾਦ', 'Ahmadabad', 459, 141, 150, 24),
    (53, 'ਫਤਿਹ ਨੰਗਲ', 'ਫਤਿਹ ਨੰਗਲ', 'Fateh Nangal', 167, 257, 350, 27),
    (54, '-DO-', 'ਫਤਿਹ ਨੰਗਲ', 'Fateh Nangal', 236, 261, 327, 33),
    (55, 'ਫੱਜੂਪੁਰਾ', 'ਫੱਜੂਪੁਰਾ', 'Fajjupura', 258, 232, 219, 20),
    (56, '-DO-', 'ਫੱਜੂਪੁਰਾ', 'Fajjupura', 91, 226, 211, 10),

    # Page 5 (Booths 57 - 70)
    (57, 'ਫੱਜੂਪੁਰਾ', 'ਫੱਜੂਪੁਰਾ', 'Fajjupura', 98, 167, 171, 13),
    (58, 'ਸੁਜਾਨਪੁਰ', 'ਸੁਜਾਨਪੁਰ', 'Sujanpur', 198, 162, 301, 33),
    (59, 'ਖੁੰਡਾ', 'ਖੁੰਡਾ', 'Khunda', 242, 252, 226, 31),
    (60, '-DO-', 'ਖੁੰਡਾ', 'Khunda', 234, 303, 147, 19),
    (61, 'ਖੁੰਡੀ', 'ਖੁੰਡੀ', 'Khundi', 162, 275, 225, 30),
    (62, 'ਲੇਹਲ', 'ਲੇਹਲ', 'Lehal', 148, 209, 170, 34),
    (63, '-DO-', 'ਲੇਹਲ', 'Lehal', 182, 149, 279, 32),
    (64, '-DO-', 'ਲੇਹਲ', 'Lehal', 194, 222, 262, 39),
    (65, 'ਬੜੋਏ', 'ਬੜੋਏ', 'Baroya', 123, 163, 139, 17),
    (66, 'ਜਫਰਵਾਲ', 'ਜਫਰਵਾਲ', 'Jafarwal', 194, 275, 156, 105),
    (67, '-DO-', 'ਜਫਰਵਾਲ', 'Jafarwal', 148, 167, 314, 50),
    (68, '-DO-', 'ਜਫਰਵਾਲ', 'Jafarwal', 210, 270, 231, 79),
    (69, 'ਸਿਧਵਾਂ', 'ਸਿਧਵਾਂ', 'Sidhwan', 177, 105, 206, 26),
    (70, 'ਮੱਲੀਆਂ ਫਕੀਰਾਂ', 'ਮੱਲੀਆਂ ਫਕੀਰਾਂ', 'Mallian Fakiran', 184, 47, 238, 27),

    # Page 6 (Booths 71 - 84)
    (71, 'ਫੈਜ਼ੁੱਲਾ ਚੱਕ', 'ਫੈਜ਼ੁੱਲਾ ਚੱਕ', 'Faij Ulla Chak', 256, 152, 276, 20),
    (72, '-DO-', 'ਫੈਜ਼ੁੱਲਾ ਚੱਕ', 'Faij Ulla Chak', 127, 72, 137, 35),
    (73, 'ਦੇਹਰੀਵਾਲ ਦਰੋਗਾ', 'ਦੇਹਰੀਵਾਲ ਦਰੋਗਾ', 'Dehriwal Daroga', 364, 316, 196, 66),
    (74, '-DO-', 'ਦੇਹਰੀਵਾਲ ਦਰੋਗਾ', 'Dehriwal Daroga', 322, 277, 209, 63),
    (75, 'ਖਾਨ ਮਲਕ', 'ਖਾਨ ਮਲਕ', 'Khan Malak', 92, 70, 107, 19),
    (76, 'ਪਸਨਾਵਾਲਾ', 'ਪਸਨਾਵਾਲਾ', 'Pasnawala', 225, 239, 314, 28),
    (77, '-DO-', 'ਪਸਨਾਵਾਲਾ', 'Pasnawala', 154, 177, 85, 30),
    (78, 'ਧਾਰੀਵਾਲ ਕਲਾਂ', 'ਧਾਰੀਵਾਲ ਕਲਾਂ', 'Dhariwal Kalan', 130, 78, 130, 29),
    (79, '-DO-', 'ਧਾਰੀਵਾਲ ਕਲਾਂ', 'Dhariwal Kalan', 225, 201, 303, 48),
    (80, 'ਗਿੱਲ ਮੰਜ', 'ਗਿੱਲ ਮੰਜ', 'Gill Manj', 190, 233, 160, 57),
    (81, 'ਛੀਨਾ ਰੇਤਵਾਲਾ', 'ਛੀਨਾ ਰੇਤਵਾਲਾ', 'Chhina Retwala', 104, 144, 145, 52),
    (82, 'ਠਾਕਰ ਸੰਧੂ', 'ਠਾਕਰ ਸੰਧੂ', 'Thakar Sandhu', 153, 159, 203, 64),
    (83, '-DO-', 'ਠੱਕਰ ਸੰਧੂ', 'Thakkar Sandhu', 128, 147, 87, 40),
    (84, 'ਕੱਲੂ ਸੋਹਲ', 'ਕੱਲੂ ਸੋਹਲ', 'Kallu Sohal', 113, 155, 227, 47),

    # Page 7 (Booths 85 - 98)
    (85, 'ਜੋਗੀ ਚੀਮਾ', 'ਜੋਗੀ ਚੀਮਾ', 'Jogi Cheema', 229, 218, 262, 55),
    (86, 'ਮੱਲੀਆਂ', 'ਮੱਲੀਆਂ', 'Mallian', 96, 248, 164, 43),
    (87, 'ਬਲਾਗਣ', 'ਬਲਾਗਣ', 'Balagan', 100, 140, 153, 16),
    (88, 'ਕਾਲਾ ਬਾਲਾ', 'ਕਾਲਾ ਬਾਲਾ', 'Kala Bala', 291, 168, 333, 69),
    (89, 'ਕੋਟ ਯੋਗਰਾਜ', 'ਕੋਟ ਯੋਗਰਾਜ', 'Kot Yograj', 137, 79, 247, 44),
    (90, 'ਦੁਲੂਆਣਾ', 'ਦੁਲੂਆਣਾ', 'Duluaana', 189, 86, 181, 24),
    (91, 'ਸਹਾਈਪੁਰ', 'ਸਹਾਈਪੁਰ', 'Sahaipur', 213, 163, 165, 63),
    (92, 'ਭਿਖਾਰੀ ਹਾਰਨੀ', 'ਭਿਖਾਰੀ ਹਾਰਨੀ', 'Bhikhari Harni', 195, 101, 365, 36),
    (93, 'ਸਠਿਆਲੀ', 'ਸਠਿਆਲੀ', 'Sathiali', 158, 211, 123, 22),
    (94, '-DO-', 'ਸਠਿਆਲੀ', 'Sathiali', 131, 141, 99, 25),
    (95, 'ਕਾਹਨੂੰਵਾਨ', 'ਕਾਹਨੂੰਵਾਨ', 'Kahnuwan', 145, 185, 215, 52),
    (96, '-DO-', 'ਕਾਹਨੂੰਵਾਨ', 'Kahnuwan', 161, 173, 202, 24),
    (97, '-DO-', 'ਕਾਹਨੂੰਵਾਨ', 'Kahnuwan', 278, 200, 200, 38),
    (98, '-DO-', 'ਕਾਹਨੂੰਵਾਨ', 'Kahnuwan', 177, 262, 301, 51),

    # Page 8 (Booths 99 - 112)
    (99, 'ਕਾਹਨੂੰਵਾਨ', 'ਕਾਹਨੂੰਵਾਨ', 'Kahnuwan', 165, 182, 186, 29),
    (100, '-DO-', 'ਕਾਹਨੂੰਵਾਨ', 'Kahnuwan', 168, 116, 197, 20),
    (101, '-DO-', 'ਕਾਹਨੂੰਵਾਨ', 'Kahnuwan', 260, 168, 361, 61),
    (102, '-DO-', 'ਕਾਹਨੂੰਵਾਨ', 'Kahnuwan', 213, 152, 298, 40),
    (103, 'ਛੌੜੀਆਂ ਬਾਂਗਰ', 'ਛੌੜੀਆਂ ਬਾਂਗਰ', 'Chhaurian Bangar', 103, 71, 115, 18),
    (104, 'ਕੋਟਲੀ ਸੈਣੀਆਂ', 'ਕੋਟਲੀ ਸੈਣੀਆਂ', 'Kotli Sainian', 106, 236, 141, 53),
    (105, '-DO-', 'ਕੋਟਲੀ ਸੈਣੀਆਂ', 'Kotli Sainian', 4, 48, 3, 4),
    (106, 'ਸੈਦੋਵਾਲ ਖੁਰਦ', 'ਸੈਦੋਵਾਲ ਖੁਰਦ', 'Saidowal Khurd', 142, 118, 113, 56),
    (107, 'ਭੈਣੀ ਕਾਨੀਆਂ', 'ਭੈਣੀ ਕਾਨੀਆਂ', 'Bhaini Kanian', 121, 172, 152, 45),
    (108, 'ਦਾਰਾਪੁਰ', 'ਦਾਰਾਪੁਰ', 'Darapur', 345, 125, 395, 45),
    (109, 'ਗੁਨੋਪੁਰ', 'ਗੁਨੋਪੁਰ', 'Gunopur', 78, 177, 172, 100),
    (110, 'ਗੁਨੋਪੁਰ', 'ਗੁਨੋਪੁਰ', 'Gunopur', 127, 152, 192, 144),
    (111, 'ਜਾਗੋਵਾਲ ਬੇਟ', 'ਜਾਗੋਵਾਲ ਬੇਟ', 'Jagowal Bet', 192, 209, 179, 24),
    (112, 'ਜਾਗੋਵਾਲ ਬੇਟ', 'ਜਾਗੋਵਾਲ ਬੇਟ', 'Jagowal Bet', 138, 91, 257, 20),

    # Page 9 (Booths 113 - 126)
    (113, 'ਭੈਣੀ ਪਸਵਾਲ', 'ਭੈਣੀ ਪਸਵਾਲ', 'Bhaini Paswal', 279, 154, 277, 83),
    (114, 'ਭੈਣੀ ਪਸਵਾਲ', 'ਭੈਣੀ ਪਸਵਾਲ', 'Bhaini Paswal', 80, 181, 141, 63),
    (115, 'ਕਿਸ਼ਨਪੁਰ', 'ਕਿਸ਼ਨਪੁਰ', 'Kishanpur', 223, 162, 273, 70),
    (116, 'ਮੁੰਨਣ ਕਲਾਂ', 'ਮੁੰਨਣ ਕਲਾਂ', 'Munnan Kalan', 94, 94, 155, 28),
    (117, 'ਬਾਜੜ', 'ਬਾਜੜ', 'Bajar', 74, 67, 138, 34),
    (118, 'ਭੂਰੀਆਂ ਸੈਣੀਆਂ', 'ਭੂਰੀਆਂ ਸੈਣੀਆਂ', 'Bhurian Sainia', 107, 192, 297, 47),
    (119, 'ਚੱਕ ਸ਼ਰੀਫ', 'ਚੱਕ ਸ਼ਰੀਫ', 'Chak Sharif', 189, 137, 149, 105),
    (120, '-DO-', 'ਚੱਕ ਸ਼ਰੀਫ', 'Chak Sharif', 132, 141, 179, 107),
    (121, 'ਕੋਟਲਾ ਗੁਜਰਾਂ', 'ਕੋਟਲਾ ਗੁਜਰਾਂ', 'Kotla Gujran', 95, 41, 168, 14),
    (122, 'ਸੱਲੋਪੁਰ', 'ਸੱਲੋਪੁਰ', 'Sallopur', 141, 159, 238, 98),
    (123, '-DO-', 'ਸੱਲੋਪੁਰ', 'Sallopur', 89, 49, 174, 21),
    (124, 'ਕੋਟਲੀ ਰਲਵਾਂ', 'ਕੋਟਲੀ ਰਲਵਾਂ', 'Kotli Ralwan', 66, 81, 122, 2),
    (125, 'ਚੱਕ ਯਾਕੂਬ', 'ਚੱਕ ਯਾਕੂਬ', 'Chak Yaqub', 116, 112, 225, 21),
    (126, 'ਲੱਧੂਪੁਰ', 'ਲੱਧੂਪੁਰ', 'Ladhupur', 128, 368, 168, 41),

    # Page 10 (Booths 127 - 140)
    (127, 'ਨੈਣੇਕੋਟ', 'ਨੈਣੇਕੋਟ', 'Nainekot', 143, 273, 301, 37),
    (128, 'ਢੇਸੀਆਂ', 'ਢੇਸੀਆਂ', 'Dhesian', 104, 97, 171, 17),
    (129, 'ਰਾਊਵਾਲ', 'ਰਾਊਵਾਲ', 'Rauwal', 86, 83, 160, 14),
    (130, 'ਨੀਮਾਣੇ', 'ਨੀਮਾਣੇ', 'Nimane', 210, 147, 147, 20),
    (131, 'ਕੋਟ ਧੰਦਲ', 'ਕੋਟ ਧੰਦਲ', 'Kot Dhandal', 210, 178, 214, 66),
    (132, 'ਭਿਟੇਵੱਡ', 'ਭਿਟੇਵੱਡ', 'Bhite Wad', 110, 24, 285, 27),
    (133, 'ਕੋਟ ਟੋਡਰ ਮੱਲ', 'ਕੋਟ ਟੋਡਰ ਮੱਲ', 'Kot Todar Mall', 216, 132, 193, 19),
    (134, '-DO-', 'ਕੋਟ ਟੋਡਰ ਮੱਲ', 'Kot Todar Mall', 161, 113, 180, 34),
    (135, 'ਰੂੜ੍ਹਾ ਬੁੱਟਰ', 'ਰੂੜ੍ਹਾ ਬੁੱਟਰ', 'Rurha Buttar', 191, 125, 238, 31),
    (136, 'ਮਾਲੀਆ', 'ਮਾਲੀਆ', 'Malia', 88, 58, 278, 59),
    (137, 'ਖਾਰਾ', 'ਖਾਰਾ', 'Khara', 206, 70, 238, 30),
    (138, 'ਵੜੈਚ', 'ਵੜੈਚ', 'Waraich', 228, 193, 266, 59),
    (139, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 158, 184, 141, 30),
    (140, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 211, 122, 256, 16),

    # Page 11 (Booths 141 - 154)
    (141, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 195, 163, 221, 15),
    (142, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 249, 253, 180, 21),
    (143, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 152, 161, 138, 20),
    (144, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 52, 268, 496, 9),
    (145, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 354, 120, 169, 20),
    (146, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 202, 97, 110, 5),
    (147, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 111, 131, 176, 16),
    (148, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 137, 156, 185, 22),
    (149, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 317, 123, 346, 13),
    (150, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 234, 238, 290, 16),
    (151, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 234, 222, 346, 38),
    (152, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 185, 242, 334, 35),
    (153, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 211, 183, 250, 17),
    (154, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 106, 154, 413, 19),

    # Page 12 (Booths 155 - 168)
    (155, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 129, 258, 379, 26),
    (156, 'ਕਾਦੀਆਂ', 'ਕਾਦੀਆਂ', 'Qadian', 199, 204, 200, 29),
    (157, 'ਨਾਥਪੁਰ', 'ਨਾਥਪੁਰ', 'Nathpur', 331, 191, 309, 36),
    (158, 'ਪੱਤੀ ਭਗਤੂਪੁਰ', 'ਪੱਤੀ ਭਗਤੂਪੁਰ', 'Patti Bhagtupur', 99, 248, 131, 6),
    (159, 'ਨੰਗਲ ਬਾਗ਼ਬਾਨਾਂ', 'ਨੰਗਲ ਬਾਗ਼ਬਾਨਾਂ', 'Nangal Bagbana', 117, 95, 250, 21),
    (160, 'ਛੋਟਾ ਨੰਗਲ', 'ਛੋਟਾ ਨੰਗਲ', 'Chota Nangal', 111, 60, 134, 7),
    (161, 'ਕਾਹਲਵਾਂ', 'ਕਾਹਲਵਾਂ', 'Kahalwan', 233, 63, 447, 42),
    (162, '-DO-', 'ਕਾਹਲਵਾਂ', 'Kahalwan', 164, 182, 197, 41),
    (163, '-DO-', 'ਕਾਹਲਵਾਂ', 'Kahalwan', 140, 124, 156, 22),
    (164, 'ਬਸਰਾਏ', 'ਬਸਰਾਏ', 'Basrai', 206, 260, 289, 22),
    (165, '-DO-', 'ਬਸਰਾਏ', 'Basrai', 238, 121, 173, 60),
    (166, '-DO-', 'ਬਸਰਾਏ', 'Basrai', 257, 91, 270, 50),
    (167, 'ਭੈਣੀ ਬਾਂਗਰ', 'ਭੈਣੀ ਬਾਂਗਰ', 'Bhaini Bangar', 87, 236, 103, 17),
    (168, '-DO-', 'ਭੈਣੀ ਬਾਂਗਰ', 'Bhaini Banger', 128, 164, 118, 30),

    # Page 13 (Booths 169 - 182)
    (169, 'ਭੰਗਵਾਂ', 'ਭੰਗਵਾਂ', 'Bhangwan', 245, 151, 257, 40),
    (170, 'ਸਲਾਹਪੁਰ', 'ਸਲਾਹਪੁਰ', 'Salahpur', 273, 181, 328, 44),
    (171, 'ਪੰਡੋਰੀ ਮਈਆਂ ਸਿੰਘ', 'ਪੰਡੋਰੀ ਮਈਆਂ ਸਿੰਘ', 'Pandori Maiya Singh', 317, 62, 204, 11),
    (172, 'ਕੁੰਟ', 'ਕੁੰਟ', 'Kunt', 239, 106, 222, 50),
    (173, 'ਘੋਟ ਖੁਰਦ', 'ਘੋਟ ਖੁਰਦ', 'Ghot Khurd', 178, 56, 195, 9),
    (174, 'ਹੰਬੋਵਾਲ', 'ਹੰਬੋਵਾਲ', 'Hambowal', 140, 160, 226, 45),
    (175, 'ਛਿੱਬ', 'ਛਿੱਬ', 'Chibb', 153, 90, 283, 26),
    (176, 'ਭੱਠੀਆਂ', 'ਭੱਠੀਆਂ', 'Bhattian', 203, 188, 184, 29),
    (177, '-DO-', 'ਭੱਠੀਆਂ', 'Bhattian', 176, 143, 225, 29),
    (178, 'ਜਾਗੋਵਾਲ ਬਾਂਗਰ', 'ਜਾਗੋਵਾਲ ਬਾਂਗਰ', 'Jagowal Bangar', 150, 121, 375, 45),
    (179, 'ਕੀੜੀ ਅਫਗਾਨਾ', 'ਕੀੜੀ ਅਫਗਾਨਾ', 'Kiri Afgana', 185, 123, 176, 38),
    (180, 'ਕੋਟਲੀ ਹਰਚੰਦਾ', 'ਕੋਟਲੀ ਹਰਚੰਦਾ', 'Kotli Harchanda', 131, 84, 185, 18),
    (181, '-DO-', 'ਕੋਟਲੀ ਹਰਚੰਦਾ', 'Kotli Harchanda', 133, 123, 116, 26),
    (182, 'ਘੂਕਲਾ', 'ਘੂਕਲਾ', 'Ghookla', 76, 66, 79, 17),

    # Page 14 (Booths 183 - 196)
    (183, 'ਜਲਾਲਪੁਰ', 'ਜਲਾਲਪੁਰ', 'Jalalpur', 131, 87, 310, 21),
    (184, 'ਬਗੋਲ', 'ਬਗੋਲ', 'Bagol', 295, 172, 226, 35),
    (185, 'ਲਖਣਪੁਰ', 'ਲਖਣਪੁਰ', 'Lakhanpur', 128, 111, 177, 27),
    (186, 'ਤੁਗਲਵਾਲਾ', 'ਤੁਗਲਵਾਲਾ', 'Tugalwala', 252, 134, 195, 67),
    (187, '-DO-', 'ਤੁਗਲਵਾਲਾ', 'Tugalwala', 249, 243, 174, 42),
    (188, '-DO-', 'ਤੁਗਲਵਾਲ', 'Tugalwal', 300, 117, 162, 28),
    (189, 'ਸ਼ੀਂਹ ਭੱਟੀ', 'ਸ਼ੀਂਹ ਭੱਟੀ', 'Shih Bhatti', 90, 61, 160, 59),
    (190, '-DO-', 'ਸ਼ੀਂਹ ਭੱਟੀ', 'Shihn Bhatti', 136, 204, 156, 42),
    (191, 'ਬੇਰੀ', 'ਬੇਰੀ', 'Beri', 176, 153, 140, 45),
    (192, '-DO-', 'ਬੇਰੀ', 'Beri', 259, 138, 87, 40),
    (193, 'ਠਾਕਰਵਾਲ', 'ਠਾਕਰਵਾਲ', 'Thakarwal', 102, 32, 97, 46),
    (194, 'ਸੁੰਚ', 'ਸੁੰਚ', 'Sunch', 158, 73, 155, 11),
    (195, 'ਦਤਾਰਪੁਰ', 'ਦਤਾਰਪੁਰ', 'Datarpur', 202, 138, 218, 35),
    (196, 'ਕੋਟ ਖਾਨ ਮੁਹੰਮਦ', 'ਕੋਟ ਖਾਨ ਮੁਹੰਮਦ', 'Kot Khan Mohammad', 191, 123, 308, 52),

    # Page 15 (Booths 197 - 210)
    (197, 'ਫੇਰੋ ਚੇਚੀ', 'ਫੇਰੋ ਚੇਚੀ', 'Phero Chechi', 222, 129, 335, 28),
    (198, 'ਜਿੰਦੜ', 'ਜਿੰਦੜ', 'Jindarh', 126, 231, 251, 49),
    (199, 'ਘੋੜੇਵਾਹ', 'ਘੋੜੇਵਾਹ', 'Ghorhewah', 166, 117, 293, 42),
    (200, 'ਗੋਰਸੀਆਂ', 'ਗੋਰਸੀਆਂ', 'Gorsian', 131, 97, 184, 40),
    (201, 'ਨਾਨੋਵਾਲ ਖੁਰਦ', 'ਨਾਨੋਵਾਲ ਖੁਰਦ', 'Nanowal Khurd', 192, 198, 195, 50),
    (202, 'ਮਹਿੜੇ', 'ਮਹਿੜੇ', 'Mehrhe', 112, 175, 96, 37),
    (203, 'ਭੈਣੀ ਮੀਆਂ ਖਾਂ', 'ਭੈਣੀ ਮੀਆਂ ਖਾਂ', 'Bhaini Mian Khan', 170, 286, 384, 25),
    (204, '-DO-', 'ਭੈਣੀ ਮੀਆਂ ਖਾਂ', 'Bhaini Mian Khan', 225, 263, 317, 47),
    (205, 'ਝੰਡਾ ਲੁਬਾਣਾ', 'ਝੰਡਾ ਲੁਬਾਣਾ', 'Jhanda Lubana', 128, 243, 195, 47),
    (206, '-DO-', 'ਝੰਡਾ ਲੁਬਾਣਾ', 'Jhanda Lubana', 116, 144, 209, 41),
    (207, 'ਬਲਵੰਡਾ', 'ਬਲਵੰਡਾ', 'Balwanda', 117, 129, 308, 27),
    (208, 'ਛਿੱਛਰਾ', 'ਛਿੱਛਰਾ', 'Chhichra', 235, 42, 240, 33),
    (209, 'ਰਾਜੂ ਬੇਲਾ', 'ਰਾਜੂ ਬੇਲਾ', 'Rajubela', 273, 49, 496, 46),
    (210, 'ਆਲਮਾ', 'ਆਲਮਾ', 'Aalma', 69, 129, 380, 41),

    # Page 16 (Booths 211 - 223)
    (211, 'ਅਵਾਣ', 'ਅਵਾਣ', 'Awan', 229, 106, 271, 42),
    (212, 'ਮੋਚਪੁਰ', 'ਮੋਚਪੁਰ', 'Mochpur', 222, 105, 450, 38),
    (213, 'ਨਵੀਆਂ ਬਾਗੜੀਆਂ', 'ਨਵੀਆਂ ਬਾਗੜੀਆਂ', 'Nawian Bagrhian', 257, 187, 326, 45),
    (214, 'ਬਾਗੜੀਆ', 'ਬਾਗੜੀਆ', 'Bagrhia', 181, 162, 183, 68),
    (215, '-DO-', 'ਬਾਗੜੀਆ', 'Bagrhia', 119, 185, 236, 46),
    (216, 'ਰਾਜਪੁਰਾ', 'ਰਾਜਪੁਰਾ', 'Rajpura', 102, 145, 70, 15),
    (217, 'ਭੈਣੀ ਖਾਦਰ', 'ਭੈਣੀ ਖਾਦਰ', 'Bhaini Khadar', 162, 85, 199, 17),
    (218, 'ਮੁਲਾਂਵਾਲ', 'ਮੁਲਾਂਵਾਲ', 'Mulanwal', 316, 214, 143, 34),
    (219, 'ਪਸਵਾਲ', 'ਪਸਵਾਲ', 'Paswal', 124, 25, 140, 13),
    (220, 'ਫੱਤੂ ਬਰਕਤ', 'ਫੱਤੂ ਬਰਕਤ', 'Fattu Barkat', 326, 91, 152, 45),
    (221, 'ਨੂੰਨ', 'ਨੂੰਨ', 'Noon', 191, 101, 176, 17),
    (222, 'ਮੁੰਨਣ', 'ਮੁੰਨਣ', 'Munnan', 214, 34, 258, 17),
    (223, 'ਫੁੱਲੜਾ', 'ਫੁੱਲੜਾ', 'Phulrha', 182, 40, 255, 28)
]

# Build DataFrame
rows = []
for b_no, exact_name, res_name, e_name, g, j, p, b in booth_data:
    tot = g + j + p + b
    cand_votes = [('Partap Singh Bajwa (INC)', p), ('Guriqbal Singh Mahal (SAD)', g), ('Jagroop Singh Sekhwan (AAP)', j)]
    cand_votes.sort(key=lambda x: x[1], reverse=True)
    winner = cand_votes[0][0]
    lead_margin = cand_votes[0][1] - cand_votes[1][1]
    rows.append({
        'Booth No': b_no,
        'Exact Name in 2022 PDF (ਪਿੰਡ)': exact_name,
        'Village / Polling Station (Resolved Punjabi)': res_name,
        'Polling Station Name (English)': e_name,
        'Jagroop Singh Sekhwan (AAP)': j,
        'Guriqbal Singh Mahal (SAD)': g,
        'Partap Singh Bajwa (INC)': p,
        'Baaki (Others)': b,
        'Total Votes Polled': tot,
        'Leading Candidate': winner,
        'Lead Margin': lead_margin
    })

df = pd.DataFrame(rows)

# Save CSV
df.to_csv('Qadian_2022_Assembly_Booth_Results.csv', index=False, encoding='utf-8-sig')
print('Saved updated Qadian_2022_Assembly_Booth_Results.csv')

# Create Excel Workbook
wb = openpyxl.Workbook()

# Sheet 1: Boothwise Results 2022
ws1 = wb.active
ws1.title = "Boothwise Results 2022"
ws1.views.sheetView[0].showGridLines = True

# Styling tokens
font_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
fill_header = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid") # Dark Navy
fill_zebra = PatternFill(start_color="F2F5F9", end_color="F2F5F9", fill_type="solid") # Soft blue-gray
fill_winner_inc = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid") # Soft green
fill_winner_aap = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid") # Soft yellow
fill_winner_sad = PatternFill(start_color="FCE4D6", end_color="FCE4D6", fill_type="solid") # Soft orange

thin_gray = Side(border_style="thin", color="D9D9D9")
thick_bottom = Side(border_style="medium", color="1F4E79")
double_bottom = Side(border_style="double", color="1F4E79")
border_cell = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thin_gray)
border_total = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=double_bottom)

align_center = Alignment(horizontal="center", vertical="center")
align_left = Alignment(horizontal="left", vertical="center")
align_right = Alignment(horizontal="right", vertical="center")

headers = [
    'Booth No',
    'Exact Name in 2022 PDF (ਪਿੰਡ)',
    'Village Name (Resolved Punjabi)',
    'Polling Station Name (English)',
    'Jagroop Singh Sekhwan (AAP)',
    'Guriqbal Singh Mahal (SAD)',
    'Partap Singh Bajwa (INC)',
    'Baaki (Others)',
    'Total Votes Polled',
    'Leading Candidate',
    'Lead Margin'
]

ws1.append(headers)
for col_num in range(1, len(headers) + 1):
    cell = ws1.cell(row=1, column=col_num)
    cell.font = font_header
    cell.fill = fill_header
    cell.alignment = align_center
    cell.border = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thick_bottom)

ws1.row_dimensions[1].height = 28

for idx, r in enumerate(rows, start=2):
    row_vals = [
        r['Booth No'],
        r['Exact Name in 2022 PDF (ਪਿੰਡ)'],
        r['Village / Polling Station (Resolved Punjabi)'],
        r['Polling Station Name (English)'],
        r['Jagroop Singh Sekhwan (AAP)'],
        r['Guriqbal Singh Mahal (SAD)'],
        r['Partap Singh Bajwa (INC)'],
        r['Baaki (Others)'],
        f"=SUM(E{idx}:H{idx})",
        r['Leading Candidate'],
        r['Lead Margin']
    ]
    ws1.append(row_vals)
    ws1.row_dimensions[idx].height = 20
    is_zebra = (idx % 2 == 1)

    for col_num in range(1, len(row_vals) + 1):
        c = ws1.cell(row=idx, column=col_num)
        c.border = border_cell
        if is_zebra:
            c.fill = fill_zebra
        
        # Alignments & formats
        if col_num == 1:
            c.alignment = align_center
        elif col_num in [2, 3, 4]:
            c.alignment = align_left
        elif 5 <= col_num <= 9:
            c.alignment = align_right
            c.number_format = '#,##0'
        elif col_num == 10:
            c.alignment = align_center
            if 'Bajwa' in str(c.value):
                c.fill = fill_winner_inc
            elif 'Sekhwan' in str(c.value):
                c.fill = fill_winner_aap
            elif 'Mahal' in str(c.value):
                c.fill = fill_winner_sad
        elif col_num == 11:
            c.alignment = align_right
            c.number_format = '#,##0'

# Total row
tot_row = len(rows) + 2
ws1.cell(row=tot_row, column=1, value="TOTAL")
ws1.cell(row=tot_row, column=2, value="ਕੁੱਲ ਜੋੜ (All 223 Booths)")
ws1.cell(row=tot_row, column=3, value="")
ws1.cell(row=tot_row, column=4, value="Grand Total (Constituency)")
ws1.cell(row=tot_row, column=5, value=f"=SUM(E2:E{tot_row-1})")
ws1.cell(row=tot_row, column=6, value=f"=SUM(F2:F{tot_row-1})")
ws1.cell(row=tot_row, column=7, value=f"=SUM(G2:G{tot_row-1})")
ws1.cell(row=tot_row, column=8, value=f"=SUM(H2:H{tot_row-1})")
ws1.cell(row=tot_row, column=9, value=f"=SUM(I2:I{tot_row-1})")
ws1.cell(row=tot_row, column=10, value="Partap Singh Bajwa (INC Winner)")
ws1.cell(row=tot_row, column=11, value=f"=G{tot_row}-F{tot_row}")

ws1.row_dimensions[tot_row].height = 24
font_total = Font(name="Calibri", size=11, bold=True, color="1F4E79")
fill_total_row = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")

for col_num in range(1, 12):
    c = ws1.cell(row=tot_row, column=col_num)
    c.font = font_total
    c.fill = fill_total_row
    c.border = border_total
    if col_num in [1, 10]:
        c.alignment = align_center
    elif col_num in [2, 3, 4]:
        c.alignment = align_left
    else:
        c.alignment = align_right
        c.number_format = '#,##0'

# Sheet 2: Booth Rankings by Total Voters
ws2 = wb.create_sheet(title="Booth Ranking by Voters")
ws2.views.sheetView[0].showGridLines = True

headers_r = [
    'Rank',
    'Booth No',
    'Exact Name in 2022 PDF (ਪਿੰਡ)',
    'Polling Station Name (English)',
    'Total Votes Polled',
    'Partap Singh Bajwa (INC)',
    'Guriqbal Singh Mahal (SAD)',
    'Jagroop Singh Sekhwan (AAP)',
    'Leading Candidate',
    'Lead Margin'
]

ws2.append(headers_r)
for col_num in range(1, len(headers_r) + 1):
    cell = ws2.cell(row=1, column=col_num)
    cell.font = font_header
    cell.fill = fill_header
    cell.alignment = align_center
    cell.border = Border(left=thin_gray, right=thin_gray, top=thin_gray, bottom=thick_bottom)
ws2.row_dimensions[1].height = 28

sorted_rows = sorted(rows, key=lambda x: x['Total Votes Polled'], reverse=True)
for rank, r in enumerate(sorted_rows, start=1):
    row_idx = rank + 1
    row_vals = [
        rank,
        r['Booth No'],
        r['Exact Name in 2022 PDF (ਪਿੰਡ)'],
        r['Polling Station Name (English)'],
        r['Total Votes Polled'],
        r['Partap Singh Bajwa (INC)'],
        r['Guriqbal Singh Mahal (SAD)'],
        r['Jagroop Singh Sekhwan (AAP)'],
        r['Leading Candidate'],
        r['Lead Margin']
    ]
    ws2.append(row_vals)
    ws2.row_dimensions[row_idx].height = 20
    is_zebra = (row_idx % 2 == 1)

    for col_num in range(1, len(row_vals) + 1):
        c = ws2.cell(row=row_idx, column=col_num)
        c.border = border_cell
        if is_zebra:
            c.fill = fill_zebra
        if col_num in [1, 2]:
            c.alignment = align_center
        elif col_num in [3, 4]:
            c.alignment = align_left
        elif 5 <= col_num <= 8 or col_num == 10:
            c.alignment = align_right
            c.number_format = '#,##0'
        elif col_num == 9:
            c.alignment = align_center
            if 'Bajwa' in str(c.value):
                c.fill = fill_winner_inc
            elif 'Sekhwan' in str(c.value):
                c.fill = fill_winner_aap
            elif 'Mahal' in str(c.value):
                c.fill = fill_winner_sad

# Sheet 3: Constituency Summary
ws3 = wb.create_sheet(title="Constituency Summary")
ws3.views.sheetView[0].showGridLines = True

summary_title = Font(name="Calibri", size=14, bold=True, color="1F4E79")
summary_val = Font(name="Calibri", size=11)

ws3['B2'] = "2022 PUNJAB ASSEMBLY ELECTIONS - 18-QADIAN CONSTITUENCY"
ws3['B2'].font = summary_title
ws3['B3'] = "BOOTH-WISE OFFICIAL EVM VOTE TABULATION SUMMARY"
ws3['B3'].font = Font(name="Calibri", size=11, italic=True, color="595959")

headers_sum = ['Candidate Name', 'Party', 'EVM Votes Polled', 'Vote Share (%)', 'Booths Led']
for col_i, h in enumerate(headers_sum, start=2):
    cell = ws3.cell(row=5, column=col_i, value=h)
    cell.font = font_header
    cell.fill = fill_header
    cell.alignment = align_center
    cell.border = border_cell
ws3.row_dimensions[5].height = 26

lead_counts = {'Partap Singh Bajwa (INC)': 0, 'Guriqbal Singh Mahal (SAD)': 0, 'Jagroop Singh Sekhwan (AAP)': 0}
for r in rows:
    lead_counts[r['Leading Candidate']] += 1

tot_polled = sum(r['Total Votes Polled'] for r in rows)
bajwa_tot = sum(r['Partap Singh Bajwa (INC)'] for r in rows)
mahal_tot = sum(r['Guriqbal Singh Mahal (SAD)'] for r in rows)
sekhwan_tot = sum(r['Jagroop Singh Sekhwan (AAP)'] for r in rows)
baaki_tot = sum(r['Baaki (Others)'] for r in rows)

cand_summary = [
    ('Partap Singh Bajwa', 'Indian National Congress (INC)', bajwa_tot, round(bajwa_tot/tot_polled*100, 2), lead_counts['Partap Singh Bajwa (INC)'], fill_winner_inc),
    ('Guriqbal Singh Mahal', 'Shiromani Akali Dal (SAD)', mahal_tot, round(mahal_tot/tot_polled*100, 2), lead_counts['Guriqbal Singh Mahal (SAD)'], fill_winner_sad),
    ('Jagroop Singh Sekhwan', 'Aam Aadmi Party (AAP)', sekhwan_tot, round(sekhwan_tot/tot_polled*100, 2), lead_counts['Jagroop Singh Sekhwan (AAP)'], fill_winner_aap),
    ('Others (Combined)', 'Independent & Other Parties', baaki_tot, round(baaki_tot/tot_polled*100, 2), 0, None)
]

for idx, (cname, party, votes, share, led, fill_color) in enumerate(cand_summary, start=6):
    ws3.cell(row=idx, column=2, value=cname).alignment = align_left
    ws3.cell(row=idx, column=3, value=party).alignment = align_left
    c_v = ws3.cell(row=idx, column=4, value=votes)
    c_v.alignment = align_right
    c_v.number_format = '#,##0'
    c_s = ws3.cell(row=idx, column=5, value=f"{share:.2f}%")
    c_s.alignment = align_right
    c_l = ws3.cell(row=idx, column=6, value=led)
    c_l.alignment = align_center

    for c_i in range(2, 7):
        cell = ws3.cell(row=idx, column=c_i)
        cell.border = border_cell
        cell.font = Font(name="Calibri", size=11, bold=(cname=='Partap Singh Bajwa'))
        if fill_color and c_i in [2, 3]:
            cell.fill = fill_color
    ws3.row_dimensions[idx].height = 22

tot_s_row = 10
ws3.cell(row=tot_s_row, column=2, value="TOTAL (All Candidates)").font = font_total
ws3.cell(row=tot_s_row, column=3, value="223 Polling Booths").font = font_total
c_tv = ws3.cell(row=tot_s_row, column=4, value=tot_polled)
c_tv.font = font_total
c_tv.alignment = align_right
c_tv.number_format = '#,##0'
c_ts = ws3.cell(row=tot_s_row, column=5, value="100.00%")
c_ts.font = font_total
c_ts.alignment = align_right
c_tl = ws3.cell(row=tot_s_row, column=6, value=223)
c_tl.font = font_total
c_tl.alignment = align_center

for c_i in range(2, 7):
    ws3.cell(row=tot_s_row, column=c_i).border = border_total
    ws3.cell(row=tot_s_row, column=c_i).fill = fill_total_row
ws3.row_dimensions[tot_s_row].height = 24

ws3['B12'] = "KEY ELECTION HIGHLIGHTS"
ws3['B12'].font = Font(name="Calibri", size=12, bold=True, color="1F4E79")

metrics = [
    ("Winning Candidate", "Partap Singh Bajwa (INC)"),
    ("Victory Margin over SAD (Runner-up)", f"{bajwa_tot - mahal_tot:,} votes ({(bajwa_tot - mahal_tot)/tot_polled*100:.2f}%)"),
    ("Total Polled EVM Votes", f"{tot_polled:,} votes"),
    ("Total Polling Stations / Booths", "223 Booths"),
    ("Highest Vote Turnout Booth", f"Booth {sorted_rows[0]['Booth No']}: {sorted_rows[0]['Exact Name in 2022 PDF (ਪਿੰਡ)']} ({sorted_rows[0]['Total Votes Polled']:,} votes)"),
    ("Lowest Vote Turnout Booth", f"Booth {sorted_rows[-1]['Booth No']}: {sorted_rows[-1]['Exact Name in 2022 PDF (ਪਿੰਡ)']} ({sorted_rows[-1]['Total Votes Polled']:,} votes)"),
    ("Average Votes Polled per Booth", f"{tot_polled/223:.1f} votes")
]

for m_idx, (m_title, m_val) in enumerate(metrics, start=13):
    ws3.cell(row=m_idx, column=2, value=m_title).font = Font(name="Calibri", size=11, bold=True)
    ws3.cell(row=m_idx, column=3, value=m_val).font = summary_val
    ws3.cell(row=m_idx, column=2).border = border_cell
    ws3.cell(row=m_idx, column=3).border = border_cell
    ws3.row_dimensions[m_idx].height = 20

# Column widths
ws1.column_dimensions['A'].width = 12
ws1.column_dimensions['B'].width = 38
ws1.column_dimensions['C'].width = 38
ws1.column_dimensions['D'].width = 38
ws1.column_dimensions['E'].width = 24
ws1.column_dimensions['F'].width = 24
ws1.column_dimensions['G'].width = 22
ws1.column_dimensions['H'].width = 16
ws1.column_dimensions['I'].width = 18
ws1.column_dimensions['J'].width = 26
ws1.column_dimensions['K'].width = 14

ws2.column_dimensions['A'].width = 10
ws2.column_dimensions['B'].width = 12
ws2.column_dimensions['C'].width = 38
ws2.column_dimensions['D'].width = 38
ws2.column_dimensions['E'].width = 18
ws2.column_dimensions['F'].width = 22
ws2.column_dimensions['G'].width = 24
ws2.column_dimensions['H'].width = 24
ws2.column_dimensions['I'].width = 26
ws2.column_dimensions['J'].width = 14

ws3.column_dimensions['B'].width = 30
ws3.column_dimensions['C'].width = 36
ws3.column_dimensions['D'].width = 20
ws3.column_dimensions['E'].width = 18
ws3.column_dimensions['F'].width = 16

ws1.freeze_panes = "A2"
ws2.freeze_panes = "A2"

wb.save('Qadian_2022_Assembly_Booth_Results.xlsx')
print('Successfully generated updated Qadian_2022_Assembly_Booth_Results.xlsx!')
print('Successfully generated updated Qadian_2022_Assembly_Booth_Results.xlsx!')
