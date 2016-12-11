## Introdução

O objetivo deste trabalho é tentar classificar o tipo de um Pokémon baseado em seus atributos.

## Dataset

O dataset utilizado foi obtido do site [Kaggle](https://www.kaggle.com/mylesoneill/d/mylesoneill/pokemon-sun-and-moon-gen-7-stats/new-sun-and-moon-pokemon-analysis), e posteriormente filtrado para remover campos irrelevantes. Ele contém os seguintes dados:

| Variável | Significado |
| --- | --- |
| type | Tipo do Pokémon |
| HP | Pontos de vida |
| ATK | Pontos de ataque físico |
| DEF | Pontos de defesa física |
| SPA | Pontos de ataque especial |
| SPD | Pontos de defesa especial |
| SPE | Pontos de velocidade |

## Análise exploratória

### Estatísticas preliminares

var | count | mean | std | min | 25% | 50% | 75% | max
--- | --- | --- | --- | --- | --- | --- | --- | --- | 
hp | 1061 | 70.041470 | 25.893508 | 1 | 50 | 68 | 80 | 255
atk | 1061 | 79.602262 | 31.378369 | 5 | 55 | 75 | 100 | 190
def | 1061 | 73.730443 | 30.394899 | 5 | 50 | 70 | 91 | 230
spa | 1061 | 74.550424 | 31.975146 | 1 | 50 | 70 | 95 | 194
spd | 1061 | 72.911404 | 27.995681 | 2 | 50 | 70 | 90 | 230
spe | 1061 | 70.321395 | 29.328288 | 5 | 48 | 68 | 93 | 180

Temos um total de 1061 Pokémon, contando formas diferentes como Pokémon diferentes. Podemos observar que os stats tem comportamentos bem similares, com uma média de 70 a 80, e desvio padrão na casa dos 30.

### Contagem de Pokémon por classe (tipo)

![Pokémon por Classe](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/pie.png)

Nesse gráfico, podemos notar que o tipo Flying está muito sub-representado, com apenas 6 registros. O motivo para isso é que estamos considerando apenas tipos primários, enquanto Flying é um tipo quase exclusivamente secundário. Decidimos por remover estes registros da nossa análise posteriormente. Os demais tipos contém níveis aceitáveis de registros, sendo o tipo mais representado, Water, apenas cerca de 4x mais comum que o menos representado, Ice.

### Box plots

![Box Plot](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/boxplot.png)

Nos box plots, podemos observar que grande parte dos stats se encontram entre 0 e 160 pontos, com alguns poucos registros com valores mais elevados até cerca de 220, e dois casos extremos pertencentes à Chansey e Blissey, com 250 e 255 HP, respectivamente.

### KDE

Para uma melhor visualização, optamos por plotar as estimativas de densidade kernel ao invés de histogramas.

![KDE_HP](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/kde_hp.png)

![KDE_ATK](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/kde_atk.png)

![KDE_DEF](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/kde_def.png)

![KDE_SPA](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/kde_spa.png)

![KDE_SPD](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/kde_spd.png)

![KDE_SPE](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/kde_spe.png)

Podemos notar que a maior parte das curvas se aproxima da normal. Temos também alguma evidência de um certo nível se separabilidade; no plot SPD, por exemplo, temos uma clara separação do tipo Dragon com relação aos demais, e, no plot ATK, temos uma separação do tipo Fighting. 

### Matriz de correlações

![Correlation Matrix](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/corr_matrix.png)

Nessa matriz, podemos notar a ausência de correlações negativas. A maior correlação encontrada, entre SPD (defesa especial) e DEF (defesa física), está em níveis aceitáveis e não faria sentido tratá-la.

### Matriz de dispersão

![Scatter Matrix](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/scatter_matrix.png)

Na matriz de dispersão, podemos notar um espaço bem distribuído, com classes bem espalhadas, de modo não linearmente separável. Não existem grandes surpresas e, a impressão inicial é de que este é, em geral, um problema bem adaptado para os métodos de inteligência computacional. Devido ao grande número de classes e baixo número de variáveis, porém, é improvável que uma classificação acerte na maioria dos casos. Alvejamos, portanto, conseguir resultados notavelmente acima do que seria esperado em uma classificação aleatória.

## Classificação

### Naive Bayes

#### Acurácia: 0.172511848341

#### Matriz de confusão:

![Confusion Matrix Naive Maybes](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/confusion_matrix_naive_bayes.png)

#### Avaliação:

type | precision | recall | f1-score | support
--- | --- | --- | --- | ---
ghost | 0.20 | 0.03 | 0.06 | 87
dark | 0.17 | 0.23 | 0.19 | 61
electric | 0.14 | 0.02 | 0.03 | 130
ice | 0.12 | 0.34 | 0.18 | 106
normal | 0.23 | 0.49 | 0.31 | 126
fire | 0.00 | 0.00 | 0.00 | 37
psychic | 0.12 | 0.26 | 0.17 | 57
poison | 0.20 | 0.05 | 0.08 | 38
dragon | 0.30 | 0.26 | 0.28 | 34
water | 0.36 | 0.16 | 0.22 | 31
fighting | 0.21 | 0.03 | 0.06 | 93
steel | 0.16 | 0.12 | 0.14 | 67
rock | 0.00 | 0.00 | 0.00 | 42
fairy | 0.00 | 0.00 | 0.00 | 31
grass | 0.14 | 0.36 | 0.20 | 42
bug | 0.00 | 0.00 | 0.00 | 41
ground | 0.36 | 0.25 | 0.30 | 32
avg / total | 0.16 | 0.17 | 0.13 | 1055

Iniciamos nossa tentativa de classificação pelo método de bayes ingênuo. Podemos observar uma acurácia relativamente baixa (0.17%). Algumas classes foram completamente ignoradas, enquanto outras foram super valorizadas. A matriz de confusão revela uma certa tendência a classificar registros como do tipo Normal ou Ice. Dado o grande número de classes, o método de bayes naive já esboça uma certa capacidade de classificação, porém, é possível melhorar.

### Neural

#### Acurácia: 0.254976303318

#### Matriz de confusão

![Neural](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/confusion_matrix_neural.png)

#### Avaliação

type | precision | recall | f1-score | support
--- | --- | --- | --- | ---
ghost | 0.10 | 0.10 | 0.10 | 87
dark | 0.29 | 0.16 | 0.21 | 61
electric | 0.19 | 0.35 | 0.25 | 130
ice | 0.32 | 0.27 | 0.29 | 106
normal | 0.38 | 0.58 | 0.46 | 126
fire | 0.00 | 0.00 | 0.00 | 37
psychic | 0.23 | 0.30 | 0.26 | 57
poison | 0.20 | 0.11 | 0.14 | 38
dragon | 0.52 | 0.50 | 0.51 | 34
water | 0.22 | 0.13 | 0.16 | 31
fighting | 0.41 | 0.42 | 0.41 | 93
steel | 0.20 | 0.18 | 0.19 | 67
rock | 0.15 | 0.10 | 0.12 | 42
fairy | 0.00 | 0.00 | 0.00 | 31
grass | 0.03 | 0.02 | 0.03 | 42
bug | 0.00 | 0.00 | 0.00 | 41
ground | 0.19 | 0.16 | 0.17 | 32
avg / total | 0.23 | 0.25 | 0.24 | 1055

Em nossa segunda tentativa, utilizamos a rede neural com 1 camada de 100 neurônios. Observamos uma evolução considerável na qualidade das previsões, com uma taxa de acurácia agora superior a 1/4. Temos um score bem alto na classe Dragon - o que é interessante, dado que pudemos observar, na análise dos gráficos, uma certa separação justamente nessa classe. Temos também um contraste entre uma ótima classificação do tipo lutador, contra péssimos resultados para o tipo Fairy, ambos com quase o mesmo número de registros no dataset. A matriz de confusão é mais plana, sem nenhum tipo claramente favorecido.

### K-Neighbors

#### Acurácia: 0.297630331754

#### Matriz de confusão:

![K-Neighbors confusion matrix](https://raw.githubusercontent.com/MaiaVictor/UFRJ/master/Inteligencia_Computacional/T2/images/confusion_matrix_kneigs.png)

#### Avaliação:

type | precision | recall | f1-score | support
--- | --- | --- | --- | ---
ghost | 0.14 | 0.34 | 0.20 | 87
dark | 0.16 | 0.34 | 0.22 | 61
electric | 0.15 | 0.22 | 0.18 | 130
ice | 0.32 | 0.36 | 0.34 | 106
normal | 0.44 | 0.45 | 0.45 | 126
fire | 0.00 | 0.00 | 0.00 | 37
psychic | 0.44 | 0.33 | 0.38 | 57
poison | 0.05 | 0.03 | 0.03 | 38
dragon | 0.60 | 0.53 | 0.56 | 34
water | 0.12 | 0.03 | 0.05 | 31
fighting | 0.67 | 0.37 | 0.47 | 93
steel | 0.53 | 0.28 | 0.37 | 67
rock | 0.27 | 0.10 | 0.14 | 42
fairy | 0.00 | 0.00 | 0.00 | 31
grass | 0.33 | 0.17 | 0.22 | 42
bug | 0.14 | 0.02 | 0.04 | 41
ground | 0.27 | 0.09 | 0.14 | 32
avg / total | 0.30 | 0.27 | 0.27 | 1055

O método mais eficaz para este problema foi o K-Neighbors com 1 vizinho (ou seja, o vizinho mais próximo). Continuamos com uma péssima classificação para os tipos Fire e Fairy. Temos, porém, uma evolução, por exemplo, no recall do tipo Ghost, onde conseguimos classificar cerca de 1/3 de seus registros corretamente. O sucesso desse método eleva uma suspeita da existência de registros extremamente similares. Uma nova análise dos dados revela que este é o caso: todas as formas do Vivillon, por exemplo, possuem os mesmos stats e o mesmo tipo. Não somente, é possível observar a existência de muitos casos de Pokémon completamente diferentes, mas com stats muito similares e o mesmo tipo, devido a repetição do design de jogos anteriores. Existem, porém, situações opostas, como o Silvally, que possui formas com os mesmos stats, mas tipos diferentes, tornando-o inclassificável.


## Conclusão

Através de uma análise crítica dos resultados dos métodos de classificação utilizados, conseguimos identificar casos "defeituosos", de Pokémon com stats muito parecidos, que acabaram passando pela análise exploratória. Uma nova tentativa de classificação sem esses registros "defeituosos" poderia ser desejável, porém, o critério para realizar essa filtragem não é óbvio tendo em vista que estes são Pokémon legítimos. Excluir parte do dataset utilizando critérios arbitrários seria, no mínimo, questionável. Em geral, concluímos que classificar o tipo de um Pokémon apenas pelos seus stats é muito mais complicado que anteriormente previsto e, em alguns casos, impossível.

Apesar disso, uma alta taxa de recall e precisão em alguns tipos como Dragon e Fighting - ambos com poucos registros defeituosos - mostra que, ao menos, em alguns casos, é possível realizar uma classificação relativamente satisfatória. Curiosamente, todos esses casos são refletidos na análise exploratória e visualização dos dados, que se mostrou absolutamente indispensável em todas as etapas do trabalho.
