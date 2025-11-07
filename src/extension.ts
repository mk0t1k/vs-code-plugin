import * as vscode from "vscode";

/**
 * Text Converter - VS Code Extension
 * 
 * Основной модуль расширения для преобразования текста между различными стилями написания.
 * Предоставляет функции для преобразования в верхний/нижний регистр, camelCase, snake_case,
 * kebab-case и Title Case.
 * 
 * @version 0.1.0
 * @author Your Name
 */

/**
 * Активирует расширение при его запуске в VS Code
 * Регистрирует все команды преобразования текста
 * 
 * @param context - контекст расширения VS Code, предоставляемый при активации
 * @example
 * // Команды становятся доступными в Command Palette и контекстном меню
 */
export function activate(context: vscode.ExtensionContext) {
  /**
   * Объект, содержащий все функции преобразования текста
   * Каждая функция принимает строку и возвращает преобразованную строку
   */
  const converters = {
    /**
     * Преобразует текст в ВЕРХНИЙ РЕГИСТР
     * @param text - исходный текст для преобразования
     * @returns текст в верхнем регистре
     */
    toUpperCase: (text: string) => text.toUpperCase(),

    /**
     * Преобразует текст в нижний регистр
     * @param text - исходный текст для преобразования
     * @returns текст в нижнем регистре
     */
    toLowerCase: (text: string) => text.toLowerCase(),

    /**
     * Преобразует текст в camelCase стиль
     * Удаляет пробелы, дефисы и подчеркивания, делая следующую букву заглавной
     * @param text - исходный текст для преобразования
     * @returns текст в camelCase формате
     * @example "hello world" → "helloWorld"
     */
    toCamelCase: (text: string) =>
      text
        .toLowerCase()
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")),

    /**
     * Преобразует текст в snake_case стиль
     * Заменяет пробелы и дефисы на подчеркивания, переводит в нижний регистр
     * @param text - исходный текст для преобразования
     * @returns текст в snake_case формате
     * @example "Hello World" → "hello_world"
     */
    toSnakeCase: (text: string) =>
      text
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/\s+/g, "_")
        .toLowerCase(),

    /**
     * Преобразует текст в kebab-case стиль
     * Заменяет пробелы и подчеркивания на дефисы, переводит в нижний регистр
     * @param text - исходный текст для преобразования
     * @returns текст в kebab-case формате
     * @example "Hello World" → "hello-world"
     */
    toKebabCase: (text: string) =>
      text
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/\s+/g, "-")
        .toLowerCase(),

    /**
     * Преобразует текст в Title Case стиль
     * Первую букву каждого слова делает заглавной, остальные - строчными
     * @param text - исходный текст для преобразования
     * @returns текст в Title Case формате
     * @example "hello world" → "Hello World"
     */
    toTitleCase: (text: string) =>
      text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
  };

  /**
   * Регистрирует все команды преобразования в VS Code
   * Каждая команда становится доступной в Command Palette и контекстном меню
   */
  for (const [cmd, fn] of Object.entries(converters)) {
    /**
     * Создает disposable объект для каждой команды
     * @param command - полное имя команды (text-converter.*)
     * @param callback - функция, выполняемая при вызове команды
     */
    const disposable = vscode.commands.registerCommand(`text-converter.${cmd}`, () => {
      // Получаем активный текстовый редактор
      const editor = vscode.window.activeTextEditor;
      
      // Проверяем, что редактор существует
      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      // Получаем документ и выделенные области
      const { document, selections } = editor;

      /**
       * Выполняем редактирование документа
       * Заменяем выделенный текст преобразованным текстом
       */
      editor.edit((editBuilder) => {
        // Обрабатываем каждую выделенную область
        selections.forEach((selection) => {
          const text = document.getText(selection);
          // Если текст выделен, заменяем его преобразованной версией
          if (text) editBuilder.replace(selection, fn(text));
        });
      });
    });

    // Добавляем команду в подписки контекста для правильного управления памятью
    context.subscriptions.push(disposable);
  }
}

/**
 * Деактивирует расширение при его выгрузке
 * В текущей реализации не выполняет дополнительных действий
 */
export function deactivate() {}