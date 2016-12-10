## Otimização em Grafos - Trabalho

O objetivo deste trabalho é implementar algoritmos exatos e aproximados que resolvam o problema do caixeiro viajante.

### Solução exata 1: BruteForce

Para implementação da solução de força bruta, simplesmente percorremos todos os caminhos possíveis, mantendo registro do menor passeio encontrado.

### Solução exata 2: BackTracking

Idêntica a solução de força bruta, com o detalhe adicional de que a recursão é interrompida a qualquer momento em que o tamanho do caminho atual seja maior que o do menor passeio encontrado.

### Solução exata 3: BranchAndBound

Para a implementação da solução de branch-and-bound, adaptamos a ideia apresentada [neste link](http://lcm.csa.iisc.ernet.in/dsa/node187.html).

Explicação:

1. Começamos a explorar o grafo sem nenhuma restrição `res`;

2. Computamos `limp(res)`, o limite inferior do menor passeio possível dadas as restrições `res`. Isso é estimado através da metade do somatório do `custo(v) = pamp(v, res, 0) + pamp(v, res, 1)` de cada vértice, onde `pamp(v, res, n)` é o peso da `n`-aresta mais próxima de `v` dadas as restrições `res`;

3. Criamos dois branchs, `x` e `y`, com as seguintes restrições adicionais:

    ```JavaScript
    res_x = res + 'Os caminhos abaixo desse branch devem conter uma aresta A'
    res_y = res + 'Os caminhos abaixo desse branch não podem conter uma aresta A'
    ```

    Onde `A` é uma aresta arbitrária que não havia sido usada como restrição por nenhum branch pai;

4. Como heurística, começamos explorando o branch de menor limite inferior;

5. Quando não existem mais restrições a se impor, comparamos o caminho determinado pelas restrições em vigor com o menor caminho encontrado até então.

Paramos a recursão sempre que `res` é inválido (isso é, as restrições obrigariam que um vértice tenha um número diferente de exatamente 2 vizinhos), e sempre que o limite mínimo para o menor passeio dadas as restrições em vigor é maior que o menor caminho já encontrado.

#### Otimizando limp(res)

Computar `limp(res)` requer tempo quadrático com relação ao número total de vértices do grafo, já que precisamos, para cada um, encontrar suas arestas mais próximas dadas as restrições em vigor. Para evitar esse custo a cada branch,

1. Mantemos a lista de vizinhos de cada vértice organizada por distância, o que permite calcular o custo de cada nó em tempo, em média, constante. 

2. Criamos uma estrutura, `EdgeSelection`, que mantém um cache do somatório dos custos de todos os vértices dado um conjunto de restrições `res`. Essa estrutura permite recomputar o somatório do custo de todos os nós em tempo logarítmico (ao invés de linear) sempre que adicionamos uma nova restrição. Esse tempo não é constante devido a complexidade dos mapas e sets persistentes utilizados para associar cada vértice às suas arestas selecionadas e às restrições a ele relevantes.

### Solução aproximada: AllMST

Para uma solução aproximada, computamos a árvore geradora mínima do grafo a partir de um vértice qualquer, utilizando o algoritmo de Prim. Percorremos essa árvore utilizando uma busca de largura, de modo a determinar um passeio completo. Repetimos esse processo utilizando cada vértice como nó inicial. Retornamos o menor passeio encontrado.

### Resultado

Na tabela abaixo estão listados os caminhos mínimos encontrados e os tempos de execução de cada algoritmo. Cada linha representa um teste realizado em um grafo completo com `N` vértices e pesos de arestas aleatórios de `1` a `20`. 

N | BruteForce | BackTracking | BranchAndBound | AllMST
--- | --- | --- | --- | ---
3 | 18 (0.008s) | 18 (0.001s) | 18 (0.005s) | 18 (0.001s)
4 | 43 (0.002s) | 43 (0.000s) | 43 (0.003s) | 43 (0.000s)
5 | 41 (0.005s) | 41 (0.001s) | 41 (0.008s) | 41 (0.001s)
6 | 27 (0.007s) | 27 (0.002s) | 27 (0.003s) | 39 (0.000s)
7 | 39 (0.007s) | 39 (0.004s) | 39 (0.011s) | 44 (0.000s)
8 | 31 (0.038s) | 31 (0.006s) | 31 (0.004s) | 32 (0.000s)
9 | 26 (0.243s) | 26 (0.012s) | 26 (0.017s) | 27 (0.000s)
10 | 34 (2.226s) | 34 (0.116s) | 34 (0.040s) | 44 (0.000s)
11 | 42 (25.226s) | 42 (0.296s) | 42 (0.033s) | 55 (0.001s)
12 | - | 41 (0.903s) | 41 (0.074s) | 76 (0.001s)
13 | - | 35 (1.501s) | 35 (0.110s) | 47 (0.002s)
14 | - | 35 (11.528s) | 35 (1.545s) | 49 (0.005s)
15 | - | - | 29 (0.611s) | 65 (0.002s)
16 | - | - | 11 (0.060s) | 36 (0.003s)
17 | - | - | 32 (1.703s) | 61 (0.003s)
18 | - | - | 32 (0.458s) | 81 (0.003s)
19 | - | - | 32 (6.611s) | 105 (0.004s)
20 | - | - | - | 78 (0.004s)
21 | - | - | - | 99 (0.006s)
22 | - | - | - | 115 (0.005s)
23 | - | - | - | 169 (0.007s)

### Conclusão

Os algoritmos exatos são, em geral, extremamente ineficientes. Mesmo o melhor deles, o BranchAndBound, é incapaz de retornar um resultado em menos de 6 segundos para grafos acima de 20 vértices. O algoritmo inexato é assustadoramente eficiente em comparação, não tendo problemas para lidar com grafos muito maiores que os aqui testados. Suas soluções, porém, são muito piores que as dos algoritmos exatos.

### Replicando

Esse resultado pode ser replicado em qualquer computador com uma versão recente do [Node.js](https://nodejs.org/en/), bastando, para isso, clonar este repositório e rodar o arquivo `test.js`:

    git clone https://github.com/MaiaVictor/UFRJ/Otimizacao_em_Grafos
    cd Otimizacao_em_Grafos
    npm install
    node test.js
